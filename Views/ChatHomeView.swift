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
    @State private var pendingDraft: PendingDraft?
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
        .sheet(item: $pendingDraft) { draft in
            NavigationStack {
                DraftConfirmationView(
                    draft: draft,
                    onCancel: {
                        pendingDraft = nil
                        entries.append(
                            ChatEntry(
                                text: "Draft discarded.",
                                role: .assistant,
                                status: "Auto"
                            )
                        )
                    },
                    onConfirm: { confirmedDraft in
                        save(draft: confirmedDraft)
                        pendingDraft = nil
                    }
                )
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
            do {
                let draft = try await organizerService.organize(message: message, apiKey: apiKey)
                await MainActor.run {
                    pendingDraft = PendingDraft(from: draft, originalMessage: message)
                    isSending = false
                }
            } catch {
                await MainActor.run {
                    createTask(
                        title: message,
                        note: "AI parsing failed, so this was saved as a task instead."
                    )
                    isSending = false
                }
            }
        }
    }

    private func save(draft: PendingDraft) {
        switch draft.kind {
        case .task:
            createTask(
                title: draft.title,
                note: draft.explanation.isEmpty ? "Saved as a task." : draft.explanation,
                dueDate: parseDate(draft.dueDate),
                priority: draft.priority,
                notes: draft.notes.isEmpty ? nil : draft.notes
            )
        case .event:
            guard let startDate = parseDate(draft.startDate) else {
                createTask(
                    title: draft.originalMessage,
                    note: "This draft could not be scheduled, so it was saved as a task."
                )
                return
            }

            let endDate = parseDate(draft.endDate) ?? Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
            let event = CalendarItem(
                title: draft.title,
                startDate: startDate,
                endDate: endDate,
                allDay: draft.allDay,
                notes: draft.notes.isEmpty ? nil : draft.notes,
                location: draft.location.isEmpty ? nil : draft.location
            )
            modelContext.insert(event)

            entries.append(
                ChatEntry(
                    text: draft.explanation.isEmpty ? "Saved as an event." : draft.explanation,
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

private struct PendingDraft: Identifiable {
    let id = UUID()
    let originalMessage: String
    var kind: DraftKind
    var title: String
    var priority: String
    var dueDate: String
    var startDate: String
    var endDate: String
    var allDay: Bool
    var location: String
    var notes: String
    var explanation: String

    init(from draft: OrganizedDraft, originalMessage: String) {
        self.originalMessage = originalMessage
        self.kind = draft.kind
        self.title = draft.title
        self.priority = draft.priority ?? "medium"
        self.dueDate = draft.dueDate ?? ""
        self.startDate = draft.startDate ?? ""
        self.endDate = draft.endDate ?? ""
        self.allDay = draft.allDay ?? false
        self.location = draft.location ?? ""
        self.notes = draft.notes ?? ""
        self.explanation = draft.explanation ?? ""
    }
}

private struct DraftConfirmationView: View {
    @State var draft: PendingDraft
    let onCancel: () -> Void
    let onConfirm: (PendingDraft) -> Void

    var body: some View {
        Form {
            Section("Type") {
                Picker("Kind", selection: $draft.kind) {
                    Text("Task").tag(DraftKind.task)
                    Text("Event").tag(DraftKind.event)
                }
                .pickerStyle(.segmented)
            }

            Section("Title") {
                TextField("Title", text: $draft.title)
            }

            if draft.kind == .task {
                Section("Task Details") {
                    Picker("Priority", selection: $draft.priority) {
                        Text("Low").tag("low")
                        Text("Medium").tag("medium")
                        Text("High").tag("high")
                    }

                    TextField("Due Date (ISO 8601)", text: $draft.dueDate)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                }
            } else {
                Section("Event Details") {
                    Toggle("All Day", isOn: $draft.allDay)

                    TextField("Start (ISO 8601)", text: $draft.startDate)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()

                    TextField("End (ISO 8601)", text: $draft.endDate)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()

                    TextField("Location", text: $draft.location)
                }
            }

            Section("Notes") {
                TextField("Notes", text: $draft.notes, axis: .vertical)
                    .lineLimit(3...6)
            }

            Section("AI Reasoning") {
                TextField("Explanation", text: $draft.explanation, axis: .vertical)
                    .lineLimit(2...4)
            }
        }
        .navigationTitle("Review Draft")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel", action: onCancel)
            }

            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    onConfirm(draft)
                }
                .disabled(draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
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
