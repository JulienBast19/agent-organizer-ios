import SwiftUI
import SwiftData

struct ChatHomeView: View {
    @Environment(\.modelContext) private var modelContext

    @AppStorage("openAIAPIKey") private var openAIAPIKey = ""

    @State private var outputType: OutputType = .auto
    @State private var message = ""
    @State private var apiKeyDraft = ""
    @State private var isShowingSettings = false
    @State private var isSending = false
    @State private var entries: [ChatEntry] = [
        ChatEntry(
            text: "Capture something, then choose whether chat should use AI auto-organization or save directly as a task or event.",
            role: .assistant,
            status: nil
        )
    ]

    private let organizerService = AIOrganizerService()

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    ForEach(entries) { entry in
                        ChatBubble(entry: entry)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }

            HStack(alignment: .bottom, spacing: 12) {
                VStack(spacing: 10) {
                    Picker("Save As", selection: $outputType) {
                        ForEach(OutputType.allCases) { type in
                            Text(type.label).tag(type)
                        }
                    }
                    .pickerStyle(.segmented)

                    TextField(outputType.placeholder, text: $message)
                        .textFieldStyle(.plain)
                        .padding(12)
                        .background(Color(.systemBackground).opacity(0.1))
                        .cornerRadius(8)
                        .submitLabel(.send)
                        .onSubmit(sendMessage)
                }

                Button(action: sendMessage) {
                    if isSending {
                        ProgressView()
                            .progressViewStyle(.circular)
                            .padding(10)
                    } else {
                        Image(systemName: "paperplane.fill")
                            .font(.title2)
                            .padding(10)
                    }
                }
                .disabled(trimmedMessage.isEmpty || isSending)
                .buttonStyle(.plain)
                .glassEffect(.regular.tint(.blue).interactive(), in: .circle)
            }
            .padding()
            .glassEffect(.regular, in: .rect(cornerRadius: 24))
        }
        .navigationTitle("Chat")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("AI Key") {
                    apiKeyDraft = openAIAPIKey
                    isShowingSettings = true
                }
            }
        }
        .sheet(isPresented: $isShowingSettings) {
            NavigationStack {
                Form {
                    Section("OpenAI") {
                        SecureField("API key", text: $apiKeyDraft)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()

                        Text("Stored locally on this device and used for Auto mode.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }
                .navigationTitle("AI Settings")
                .toolbar {
                    ToolbarItem(placement: .topBarLeading) {
                        Button("Cancel") {
                            isShowingSettings = false
                        }
                    }

                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Save") {
                            openAIAPIKey = apiKeyDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                            isShowingSettings = false
                        }
                    }
                }
            }
        }
    }

    private var trimmedMessage: String {
        message.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func sendMessage() {
        let trimmedMessage = trimmedMessage
        guard !trimmedMessage.isEmpty else { return }

        entries.append(ChatEntry(text: trimmedMessage, role: .user, status: outputType.label))
        message = ""

        switch outputType {
        case .task:
            createTask(title: trimmedMessage, note: "Saved as a task.")
        case .event:
            createDefaultEvent(title: trimmedMessage)
        case .auto:
            runAutoOrganization(for: trimmedMessage)
        }
    }

    private func defaultEventStartDate() -> Date {
        let calendar = Calendar.current
        let now = Date()
        let nextHour = calendar.nextDate(
            after: now,
            matching: DateComponents(minute: 0),
            matchingPolicy: .nextTime
        )

        return nextHour ?? now.addingTimeInterval(3600)
    }

    private func createTask(title: String, note: String, dueDate: Date? = nil, priority: String = "medium", notes: String? = nil) {
        let task = TaskItem(title: title, dueDate: dueDate, priority: priority, notes: notes)
        modelContext.insert(task)
        TaskNotificationManager.shared.syncNotification(for: task)

        entries.append(
            ChatEntry(
                text: note,
                role: .assistant,
                status: "Tasks"
            )
        )
    }

    private func createDefaultEvent(title: String) {
        let startDate = defaultEventStartDate()
        let endDate = Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
        let event = CalendarItem(title: title, startDate: startDate, endDate: endDate)
        modelContext.insert(event)

        entries.append(
            ChatEntry(
                text: "Saved as an event for \(startDate.formatted(date: .omitted, time: .shortened)).",
                role: .assistant,
                status: "Calendar"
            )
        )
    }

    private func runAutoOrganization(for message: String) {
        let apiKey = openAIAPIKey.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !apiKey.isEmpty else {
            createTask(
                title: message,
                note: "Auto mode needs an OpenAI API key. Saved as a task for now."
            )
            return
        }

        isSending = true

        Task {
            defer { isSending = false }

            do {
                let draft = try await organizerService.organize(message: message, apiKey: apiKey)
                await MainActor.run {
                    apply(draft: draft, originalMessage: message)
                }
            } catch {
                await MainActor.run {
                    createTask(
                        title: message,
                        note: "AI parsing failed, so this was saved as a task instead."
                    )
                }
            }
        }
    }

    private func apply(draft: OrganizedDraft, originalMessage: String) {
        switch draft.kind {
        case .task:
            let dueDate = parseDate(draft.dueDate)
            let priority = draft.priority ?? "medium"
            let note = draft.explanation ?? "Saved as a task."

            createTask(
                title: draft.title,
                note: note,
                dueDate: dueDate,
                priority: priority,
                notes: draft.notes
            )
        case .event:
            guard let startDate = parseDate(draft.startDate) else {
                createTask(
                    title: originalMessage,
                    note: "AI could not confidently schedule this, so it was saved as a task."
                )
                return
            }

            let endDate = parseDate(draft.endDate) ?? Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
            let event = CalendarItem(
                title: draft.title,
                startDate: startDate,
                endDate: endDate,
                allDay: draft.allDay ?? false,
                notes: draft.notes,
                location: draft.location
            )
            modelContext.insert(event)

            entries.append(
                ChatEntry(
                    text: draft.explanation ?? "Saved as an event.",
                    role: .assistant,
                    status: "Calendar"
                )
            )
        }
    }

    private func parseDate(_ value: String?) -> Date? {
        guard let value, !value.isEmpty else { return nil }

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        if let date = formatter.date(from: value) {
            return date
        }

        formatter.formatOptions = [.withInternetDateTime]
        return formatter.date(from: value)
    }
}

private enum OutputType: String, CaseIterable, Identifiable {
    case auto
    case task
    case event

    var id: String { rawValue }

    var label: String {
        switch self {
        case .auto:
            return "Auto"
        case .task:
            return "Task"
        case .event:
            return "Event"
        }
    }

    var placeholder: String {
        switch self {
        case .auto:
            return "Ask naturally..."
        case .task:
            return "Write a task..."
        case .event:
            return "Write an event..."
        }
    }
}

private struct ChatEntry: Identifiable {
    enum Role {
        case user
        case assistant
    }

    let id = UUID()
    let text: String
    let role: Role
    let status: String?
}

private struct ChatBubble: View {
    let entry: ChatEntry

    var body: some View {
        VStack(alignment: entry.role == .user ? .trailing : .leading, spacing: 6) {
            Text(entry.text)
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity, alignment: entry.role == .user ? .trailing : .leading)
                .background(bubbleColor)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            if let status = entry.status {
                Text(status)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: entry.role == .user ? .trailing : .leading)
    }

    private var bubbleColor: Color {
        switch entry.role {
        case .user:
            return .blue.opacity(0.16)
        case .assistant:
            return Color(.secondarySystemBackground)
        }
    }
}

struct ChatHomeView_Previews: PreviewProvider {
    static var previews: some View {
        ChatHomeView()
    }
}
