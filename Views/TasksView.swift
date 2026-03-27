                      import SwiftUI

struct TasksView: View {
    @State private var tasks: [TaskItem] = [
        TaskItem(id: UUID(), title: "Finish grant draft", dueDate: Calendar.current.date(byAdding: .day, value: 1, to: Date())!, priority: .high, completed: false),
        TaskItem(id: UUID(), title: "Buy groceries", dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date())!, priority: .medium, completed: false),
        TaskItem(id: UUID(), title: "Plan weekend hike", dueDate: nil, priority: .low, completed: false)
    ]

    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Today")) {
                    ForEach(tasks.filter { $0.isDueToday }, id: \.​id) { task in
                        TaskRow(task: task)
                    }
                }
                Section(header: Text("Upcoming")) {
                    ForEach(tasks.filter { $0.isUpcoming }, id: \.​id) { task in
                        TaskRow(task: task)
                    }
                }
                Section(header: Text("Someday")) {
                    ForEach(tasks.filter { $0.dueDate == nil }, id: \.​id) { task in
                        TaskRow(task: task)
                    }
                }
            }
            .navigationTitle("Tasks")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: addTask) {
                        Image(systemName: "plus")
                    }
                }
            }
        }
    }

    private func addTask() {
        // placeholder: no UI for adding tasks yet
        tasks.append(TaskItem(id: UUID(), title: "New Task", dueDate: nil, priority: .medium, completed: false))
    }
}

struct TaskRow: View {
    var task: TaskItem

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(task.title)
                    .font(.headline)
                if let due = task.dueDate {
                    Text(due, style: .date)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Circle()
                .fill(task.priority.color)
                .frame(width: 10, height: 10)
        }
    }
}

extension TaskItem.Priority {
    var color: Color {
        switch self {
        case .low: return .green
        case .medium: return .yellow
        case .high: return .red
        }
    }
}

extension TaskItem {
    var isDueToday: Bool {
        guard let due = dueDate else { return false }
        return Calendar.current.isDateInToday(due)
    }

    var isUpcoming: Bool {
        guard let due = dueDate else { return false }
        return due > Date() && !Calendar.current.isDateInToday(due)
    }
}
