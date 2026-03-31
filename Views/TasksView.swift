import SwiftUI
import SwiftData

struct TasksView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var tasks: [TaskItem]

    @State private var newTaskTitle = ""

    private let calendar = Calendar.current

    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(red: 0.96, green: 0.98, blue: 1.0),
                        Color(red: 0.99, green: 0.98, blue: 0.95)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                List {
                    addTaskSection

                    taskSection("Today", tasks: todayTasks)
                    taskSection("Upcoming", tasks: upcomingTasks)
                    taskSection("Someday", tasks: somedayTasks)
                }
                .scrollContentBackground(.hidden)
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Tasks")
        }
    }

    private var addTaskSection: some View {
        Section("Add Task") {
            HStack(spacing: 12) {
                TextField("What needs doing?", text: $newTaskTitle)
                    .textInputAutocapitalization(.sentences)
                    .submitLabel(.done)
                    .onSubmit(addTask)

                Button(action: addTask) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                }
                .disabled(trimmedNewTaskTitle.isEmpty)
            }
        }
    }

    @ViewBuilder
    private func taskSection(_ title: String, tasks: [TaskItem]) -> some View {
        Section {
            if tasks.isEmpty {
                Text(emptyStateText(for: title))
                    .foregroundStyle(.secondary)
            } else {
                ForEach(tasks) { task in
                    NavigationLink(destination: TaskDetailView(task: task)) {
                        TaskRow(task: task) {
                            toggleCompletion(for: task)
                        }
                    }
                }
                .onDelete { offsets in
                    deleteTasks(at: offsets, from: tasks)
                }
            }
        } header: {
            HStack {
                Text(title)
                Spacer()
                Text("\(tasks.count)")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.8))
                    .clipShape(Capsule())
            }
        }
    }

    private var sortedTasks: [TaskItem] {
        tasks.sorted { lhs, rhs in
            switch (lhs.dueDate, rhs.dueDate) {
            case let (left?, right?):
                if left != right {
                    return left < right
                }
            case (.some, .none):
                return true
            case (.none, .some):
                return false
            case (.none, .none):
                break
            }

            if lhs.completed != rhs.completed {
                return !lhs.completed && rhs.completed
            }

            return lhs.title.localizedCaseInsensitiveCompare(rhs.title) == .orderedAscending
        }
    }

    private var todayTasks: [TaskItem] {
        sortedTasks.filter { task in
            guard let dueDate = task.dueDate else { return false }
            return calendar.isDateInToday(dueDate)
        }
    }

    private var upcomingTasks: [TaskItem] {
        sortedTasks.filter { task in
            guard let dueDate = task.dueDate else { return false }
            return dueDate > Date() && !calendar.isDateInToday(dueDate)
        }
    }

    private var somedayTasks: [TaskItem] {
        sortedTasks.filter { $0.dueDate == nil }
    }

    private var trimmedNewTaskTitle: String {
        newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func addTask() {
        let title = trimmedNewTaskTitle
        guard !title.isEmpty else { return }

        let task = TaskItem(title: title)
        modelContext.insert(task)
        TaskNotificationManager.shared.syncNotification(for: task)
        newTaskTitle = ""
    }

    private func toggleCompletion(for task: TaskItem) {
        task.completed.toggle()
        TaskNotificationManager.shared.syncNotification(for: task)
    }

    private func deleteTasks(at offsets: IndexSet, from sectionTasks: [TaskItem]) {
        for index in offsets {
            let task = sectionTasks[index]
            TaskNotificationManager.shared.removeNotification(for: task)
            modelContext.delete(task)
        }
    }

    private func emptyStateText(for sectionTitle: String) -> String {
        switch sectionTitle {
        case "Today":
            return "No tasks due today."
        case "Upcoming":
            return "No upcoming tasks yet."
        default:
            return "No tasks without a date."
        }
    }
}

struct TaskRow: View {
    let task: TaskItem
    let onToggleComplete: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onToggleComplete) {
                Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(task.completed ? .green : .secondary)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.headline)
                    .foregroundStyle(task.completed ? .secondary : .primary)
                    .strikethrough(task.completed)

                if let dueDate = task.dueDate {
                    Text(dueDate.formatted(date: .abbreviated, time: .shortened))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer(minLength: 12)

            VStack(alignment: .trailing, spacing: 6) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(priorityColor)
                    .frame(width: 10, height: 28)

                if let dueDate = task.dueDate, dueDate < Date(), !task.completed {
                    Text("Overdue")
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(.red)
                }
            }
        }
        .padding(.vertical, 8)
    }

    private var priorityColor: Color {
        switch task.priority.lowercased() {
        case "high":
            return .red
        case "low":
            return .green
        default:
            return .orange
        }
    }
}
