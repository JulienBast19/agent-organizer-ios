import Foundation

enum TaskPriority: String, CaseIterable, Identifiable {
    case low
    case medium
    case high

    var id: String { rawValue }
}

struct TaskItem: Identifiable {
    let id: UUID = UUID()
    var title: String
    var dueDate: Date?
    var priority: TaskPriority
    var completed: Bool = false
    var notes: String?
}

extension TaskItem {
    static var sampleTasks: [TaskItem] {
        [
            TaskItem(title: "Buy groceries", dueDate: Calendar.current.date(byAdding: .day, value: 1, to: Date()), priority: .medium),
            TaskItem(title: "Submit assignment", dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date()), priority: .high),
            TaskItem(title: "Read book", dueDate: nil, priority: .low)
        ]
    }
}
