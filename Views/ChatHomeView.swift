import SwiftUI
import SwiftData

struct ChatHomeView: View {
    @Environment(\.modelContext) private var modelContext

    @Query private var messages: [ChatMessage]
    @Query private var tasks: [TaskItem]
    @Query private var events: [CalendarItem]

    @State private var openAIAPIKey = ""
    @State private var outputType: OutputType = .auto
    @State private var message = ""
    @State private var apiKeyDraft = ""
    @State private var isShowingSettings = false
    @State private var isSending = false
    @State private var pendingDraft: PendingDraft?
    @State private var selectedTask: TaskItem?
    @State private var selectedEvent: CalendarItem?
    @State private var notice: InlineNotice?

    private let organizerService = AIOrganizerService()

    var body: some View {
        VStack(spacing: 0) {
            if showsAutoOnboarding {
                AutoModeBanner {
                    apiKeyDraft = openAIAPIKey
                    isShowingSettings = true
                }
                .padding(.horizontal)
                .padding(.top, 8)
            }

            if let notice {
                InlineNoticeView(notice: notice)
                    .padding(.horizontal)
                    .padding(.top, 8)
            }

            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 16) {
                        ForEach(groupedMessages) { group in
                            MessageDaySection(group: group)

                            ForEach(group.messages) { entry in
                                ChatBubble(
                                    message: entry,
                                    linkedPreview: linkedPreview(for: entry),
                                    onOpenLinkedItem: {
                                        openLinkedItem(for: entry)
                                    }
                                )
                                .id(entry.persistentModelID)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                }
                .onAppear {
                    scrollToBottom(using: proxy)
                }
                .onChange(of: sortedMessages.count) {
                    scrollToBottom(using: proxy)
                }
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
        .onAppear(perform: ensureWelcomeMessage)
        .onAppear(perform: loadAPIKey)
        .sheet(isPresented: $isShowingSettings) {
            settingsSheet
        }
        .sheet(item: $pendingDraft) { draft in
            NavigationStack {
                DraftConfirmationView(
                    draft: draft,
                    onCancel: {
                        pendingDraft = nil
                        appendAssistantMessage(text: "Draft discarded.", status: "Auto")
                    },
                    onConfirm: { confirmedDraft in
                        save(draft: confirmedDraft)
                        pendingDraft = nil
                    }
                )
            }
        }
        .sheet(item: $selectedTask) { task in
            NavigationStack {
                TaskDetailView(task: task)
            }
        }
        .sheet(item: $selectedEvent) { event in
            NavigationStack {
                CalendarDetailView(event: event)
            }
        }
    }

    private var settingsSheet: some View {
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
                            saveAPIKey()
                            isShowingSettings = false
                        }
                    }
            }
        }
    }

    private var sortedMessages: [ChatMessage] {
        messages.sorted { $0.createdAt < $1.createdAt }
    }

    private var groupedMessages: [MessageGroup] {
        let grouped = Dictionary(grouping: sortedMessages) { message in
            Calendar.current.startOfDay(for: message.createdAt)
        }

        return grouped.keys.sorted().map { day in
            MessageGroup(day: day, messages: grouped[day] ?? [])
        }
    }

    private var trimmedMessage: String {
        message.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private var showsAutoOnboarding: Bool {
        outputType == .auto && openAIAPIKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func ensureWelcomeMessage() {
        guard messages.isEmpty else { return }

        modelContext.insert(
            ChatMessage(
                text: "Capture something, then choose whether chat should use AI auto-organization or save directly as a task or event.",
                role: ChatRole.assistant.rawValue
            )
        )
    }

    private func loadAPIKey() {
        openAIAPIKey = KeychainService.loadOpenAIKey()
    }

    private func saveAPIKey() {
        let trimmed = apiKeyDraft.trimmingCharacters(in: .whitespacesAndNewlines)

        if trimmed.isEmpty {
            _ = KeychainService.deleteOpenAIKey()
            openAIAPIKey = ""
        } else if KeychainService.saveOpenAIKey(trimmed) {
            openAIAPIKey = trimmed
            notice = InlineNotice(
                text: "OpenAI API key saved securely in Keychain.",
                style: .success
            )
        } else {
            notice = InlineNotice(
                text: "The API key could not be saved securely.",
                style: .error
            )
        }
    }

    private func sendMessage() {
        let trimmedMessage = trimmedMessage
        guard !trimmedMessage.isEmpty else { return }

        modelContext.insert(
            ChatMessage(
                text: trimmedMessage,
                role: ChatRole.user.rawValue,
                status: outputType.label
            )
        )
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

        appendAssistantMessage(
            text: note,
            status: "Tasks",
            linkedKind: "task",
            linkedRecordID: task.recordID,
            linkedTitle: task.title
        )
    }

    private func createDefaultEvent(title: String) {
        let startDate = defaultEventStartDate()
        let endDate = Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
        let event = CalendarItem(title: title, startDate: startDate, endDate: endDate)
        modelContext.insert(event)

        appendAssistantMessage(
            text: "Saved as an event for \(startDate.formatted(date: .omitted, time: .shortened)).",
            status: "Calendar",
            linkedKind: "event",
            linkedRecordID: event.recordID,
            linkedTitle: event.title
        )
    }

    private func runAutoOrganization(for message: String) {
        let apiKey = openAIAPIKey.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !apiKey.isEmpty else {
            notice = InlineNotice(
                text: "Add an OpenAI API key to use Auto mode. The message was saved conservatively as a task.",
                style: .warning
            )
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
                    if draft.kind == .event, draft.confidence == "low" {
                        notice = InlineNotice(
                            text: "AI marked this as low-confidence, so it was kept as a task instead of scheduling it automatically.",
                            style: .warning
                        )
                        createTask(
                            title: draft.title.isEmpty ? message : draft.title,
                            note: "AI was not confident enough to schedule this, so it was saved as a task.",
                            dueDate: parseDate(draft.dueDate),
                            priority: draft.priority ?? "medium",
                            notes: draft.notes
                        )
                    } else {
                        pendingDraft = PendingDraft(from: draft, originalMessage: message)
                    }
                    isSending = false
                }
            } catch {
                await MainActor.run {
                    createTask(
                        title: message,
                        note: "AI parsing failed, so this was saved as a task instead."
                    )
                    notice = InlineNotice(
                        text: "The AI request failed, so the app fell back to a task. You can still review or edit it normally.",
                        style: .error
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
                dueDate: draft.hasDueDate ? draft.dueDate : nil,
                priority: draft.priority,
                notes: draft.notes.isEmpty ? nil : draft.notes
            )
        case .event:
            guard let startDate = draft.startDate else {
                createTask(
                    title: draft.originalMessage,
                    note: "This draft could not be scheduled, so it was saved as a task."
                )
                return
            }

            let endDate = draft.endDate ?? Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
            let event = CalendarItem(
                title: draft.title,
                startDate: startDate,
                endDate: endDate,
                allDay: draft.allDay,
                notes: draft.notes.isEmpty ? nil : draft.notes,
                location: draft.location.isEmpty ? nil : draft.location
            )
            modelContext.insert(event)

            appendAssistantMessage(
                text: draft.explanation.isEmpty ? "Saved as an event." : draft.explanation,
                status: "Calendar",
                linkedKind: "event",
                linkedRecordID: event.recordID,
                linkedTitle: event.title
            )
        }
    }

    private func appendAssistantMessage(text: String, status: String? = nil, linkedKind: String? = nil, linkedRecordID: String? = nil, linkedTitle: String? = nil) {
        modelContext.insert(
            ChatMessage(
                text: text,
                role: ChatRole.assistant.rawValue,
                status: status,
                linkedKind: linkedKind,
                linkedRecordID: linkedRecordID,
                linkedTitle: linkedTitle
            )
        )
    }

    private func openLinkedItem(for message: ChatMessage) {
        guard let linkedKind = message.linkedKind, let linkedRecordID = message.linkedRecordID else { return }

        switch linkedKind {
        case "task":
            selectedTask = tasks.first(where: { $0.recordID == linkedRecordID })
        case "event":
            selectedEvent = events.first(where: { $0.recordID == linkedRecordID })
        default:
            break
        }
    }

    private func linkedPreview(for message: ChatMessage) -> LinkedPreview? {
        guard let linkedKind = message.linkedKind, let linkedRecordID = message.linkedRecordID else {
            return nil
        }

        switch linkedKind {
        case "task":
            guard let task = tasks.first(where: { $0.recordID == linkedRecordID }) else {
                return nil
            }

            let subtitle: String
            if task.completed {
                subtitle = "Completed"
            } else if let dueDate = task.dueDate {
                subtitle = "Due \(dueDate.formatted(date: .abbreviated, time: .shortened))"
            } else {
                subtitle = "No due date"
            }

            return LinkedPreview(
                title: task.title,
                subtitle: subtitle,
                iconName: "checklist",
                accent: .green,
                badges: taskBadges(for: task)
            )
        case "event":
            guard let event = events.first(where: { $0.recordID == linkedRecordID }) else {
                return nil
            }

            let subtitle: String
            if event.allDay {
                subtitle = event.startDate.formatted(date: .abbreviated, time: .omitted)
            } else {
                subtitle = "\(event.startDate.formatted(date: .abbreviated, time: .shortened))"
            }

            return LinkedPreview(
                title: event.title,
                subtitle: subtitle,
                iconName: "calendar",
                accent: .orange,
                badges: eventBadges(for: event)
            )
        default:
            return nil
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

    private func taskBadges(for task: TaskItem) -> [LinkedBadgeItem] {
        var badges: [LinkedBadgeItem] = []

        if task.completed {
            badges.append(.init(title: "Completed", tint: .green))
        } else if let dueDate = task.dueDate, dueDate < Date() {
            badges.append(.init(title: "Overdue", tint: .red))
        } else if task.dueDate != nil {
            badges.append(.init(title: "Upcoming", tint: .orange))
        }

        return badges
    }

    private func eventBadges(for event: CalendarItem) -> [LinkedBadgeItem] {
        var badges: [LinkedBadgeItem] = []

        if event.allDay {
            badges.append(.init(title: "All Day", tint: .blue))
        }

        if event.startDate > Date() {
            badges.append(.init(title: "Upcoming", tint: .orange))
        }

        return badges
    }

    private func scrollToBottom(using proxy: ScrollViewProxy) {
        guard let lastMessage = sortedMessages.last else { return }

        withAnimation(.easeOut(duration: 0.2)) {
            proxy.scrollTo(lastMessage.persistentModelID, anchor: .bottom)
        }
    }
}

private enum ChatRole: String {
    case user
    case assistant
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
    var hasDueDate: Bool
    var dueDate: Date
    var startDate: Date?
    var endDate: Date?
    var allDay: Bool
    var location: String
    var notes: String
    var explanation: String
    var confidence: String

    init(from draft: OrganizedDraft, originalMessage: String) {
        let parser = ISO8601DateFormatter()
        parser.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        func parse(_ value: String?) -> Date? {
            guard let value, !value.isEmpty else { return nil }

            if let date = parser.date(from: value) {
                return date
            }

            parser.formatOptions = [.withInternetDateTime]
            return parser.date(from: value)
        }

        let parsedDueDate = parse(draft.dueDate)
        let parsedStartDate = parse(draft.startDate)
        let parsedEndDate = parse(draft.endDate)

        self.originalMessage = originalMessage
        self.kind = draft.kind
        self.title = draft.title
        self.priority = draft.priority ?? "medium"
        self.hasDueDate = parsedDueDate != nil
        self.dueDate = parsedDueDate ?? Date()
        self.startDate = parsedStartDate
        self.endDate = parsedEndDate
        self.allDay = draft.allDay ?? false
        self.location = draft.location ?? ""
        self.notes = draft.notes ?? ""
        self.explanation = draft.explanation ?? ""
        self.confidence = draft.confidence ?? "medium"
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

                    Toggle("Has Due Date", isOn: $draft.hasDueDate)

                    if draft.hasDueDate {
                        DatePicker(
                            "Due Date",
                            selection: $draft.dueDate,
                            displayedComponents: [.date, .hourAndMinute]
                        )
                    }
                }
            } else {
                Section("Event Details") {
                    Toggle("All Day", isOn: $draft.allDay)

                    DatePicker(
                        "Start",
                        selection: Binding(
                            get: { draft.startDate ?? Date() },
                            set: { draft.startDate = $0 }
                        ),
                        displayedComponents: draft.allDay ? [.date] : [.date, .hourAndMinute]
                    )

                    DatePicker(
                        "End",
                        selection: Binding(
                            get: { draft.endDate ?? draft.startDate ?? Date() },
                            set: { draft.endDate = $0 }
                        ),
                        displayedComponents: draft.allDay ? [.date] : [.date, .hourAndMinute]
                    )

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

                Text("Confidence: \(draft.confidence.capitalized)")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
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
        .onChange(of: draft.kind) {
            if draft.kind == .event {
                if draft.startDate == nil {
                    draft.startDate = Date()
                }

                if draft.endDate == nil, let startDate = draft.startDate {
                    draft.endDate = Calendar.current.date(byAdding: .hour, value: 1, to: startDate)
                }
            }
        }
        .onChange(of: draft.startDate) {
            guard let startDate = draft.startDate else { return }

            if let endDate = draft.endDate, endDate < startDate {
                draft.endDate = startDate
            }
        }
        .onChange(of: draft.allDay) {
            guard draft.kind == .event else { return }
            guard let startDate = draft.startDate else { return }

            if draft.allDay {
                let calendar = Calendar.current
                draft.startDate = calendar.startOfDay(for: startDate)

                if let endDate = draft.endDate {
                    draft.endDate = calendar.startOfDay(for: max(endDate, startDate))
                }
            }
        }
    }
}

private struct ChatBubble: View {
    let message: ChatMessage
    let linkedPreview: LinkedPreview?
    let onOpenLinkedItem: () -> Void

    var body: some View {
        VStack(alignment: isUser ? .trailing : .leading, spacing: 6) {
            Text(message.text)
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity, alignment: isUser ? .trailing : .leading)
                .background(bubbleColor)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            if let status = message.status {
                Text(status)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Text(message.createdAt.formatted(date: .omitted, time: .shortened))
                .font(.caption2)
                .foregroundStyle(.secondary)

            if let linkedPreview {
                Button(action: onOpenLinkedItem) {
                    HStack(spacing: 10) {
                        Image(systemName: linkedPreview.iconName)
                            .foregroundStyle(linkedPreview.accent)
                            .frame(width: 24)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(linkedPreview.title)
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.primary)

                            Text(linkedPreview.subtitle)
                                .font(.caption)
                                .foregroundStyle(.secondary)

                            if !linkedPreview.badges.isEmpty {
                                HStack(spacing: 6) {
                                    ForEach(linkedPreview.badges, id: \.title) { badge in
                                        LinkedBadge(badge: badge)
                                    }
                                }
                            }
                        }

                        Spacer()

                        Image(systemName: "arrow.up.right.square")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(10)
                    .background(Color(.tertiarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                .buttonStyle(.plain)
            }
        }
        .frame(maxWidth: .infinity, alignment: isUser ? .trailing : .leading)
    }

    private var isUser: Bool {
        message.role == ChatRole.user.rawValue
    }

    private var bubbleColor: Color {
        isUser ? .blue.opacity(0.16) : Color(.secondarySystemBackground)
    }
}

private struct LinkedPreview {
    let title: String
    let subtitle: String
    let iconName: String
    let accent: Color
    let badges: [LinkedBadgeItem]
}

private struct LinkedBadgeItem {
    let title: String
    let tint: Color
}

private struct LinkedBadge: View {
    let badge: LinkedBadgeItem

    var body: some View {
        Text(badge.title)
            .font(.caption2.weight(.medium))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(badge.tint.opacity(0.14))
            .foregroundStyle(badge.tint)
            .clipShape(Capsule())
    }
}

private struct MessageGroup: Identifiable {
    let day: Date
    let messages: [ChatMessage]

    var id: Date { day }
}

private struct MessageDaySection: View {
    let group: MessageGroup

    var body: some View {
        HStack(spacing: 12) {
            Rectangle()
                .fill(Color.secondary.opacity(0.2))
                .frame(height: 1)

            Text(group.day.formatted(.dateTime.weekday(.wide).month().day()))
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)

            Rectangle()
                .fill(Color.secondary.opacity(0.2))
                .frame(height: 1)
        }
    }
}

private struct InlineNotice: Identifiable {
    enum Style {
        case success
        case warning
        case error

        var tint: Color {
            switch self {
            case .success:
                return .green
            case .warning:
                return .orange
            case .error:
                return .red
            }
        }

        var iconName: String {
            switch self {
            case .success:
                return "checkmark.circle.fill"
            case .warning:
                return "exclamationmark.triangle.fill"
            case .error:
                return "xmark.octagon.fill"
            }
        }
    }

    let id = UUID()
    let text: String
    let style: Style
}

private struct InlineNoticeView: View {
    let notice: InlineNotice

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: notice.style.iconName)
                .foregroundStyle(notice.style.tint)

            Text(notice.text)
                .font(.footnote)
                .foregroundStyle(.primary)

            Spacer()
        }
        .padding(12)
        .background(notice.style.tint.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

private struct AutoModeBanner: View {
    let onConfigure: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "sparkles.rectangle.stack")
                .font(.title3)
                .foregroundStyle(.blue)

            VStack(alignment: .leading, spacing: 4) {
                Text("Auto mode needs an API key")
                    .font(.subheadline.weight(.semibold))

                Text("Add your OpenAI key to let chat classify and schedule messages automatically.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button("Set Up", action: onConfigure)
                .buttonStyle(.borderedProminent)
                .controlSize(.small)
        }
        .padding(14)
        .background(Color.blue.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}

struct ChatHomeView_Previews: PreviewProvider {
    static var previews: some View {
        ChatHomeView()
    }
}
