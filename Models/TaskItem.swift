import Foundation
import SwiftData

@Model
class TaskItem {
    var title: String
    var dueDate: Date?
    var priority: String
    var completed: Bool
    var notes: String?

    init(title: String, dueDate: Date? = nil, priority: String = "medium", completed: Bool = false, notes: String? = nil) {
        self.title = title
        self.dueDate = dueDate
        self.priority = priority
        self.completed = completed
        self.notes = notes
    }
}

extension TaskItem {
    static var sampleTasks: [TaskItem] {
        [
            TaskItem(title: "Buy groceries", dueDate: Calendar.current.date(byAdding: .day, value: 1, to: Date()), priority: "medium"),
            TaskItem(title: "Submit assignment", dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date()), priority: "high"),
            TaskItem(title: "Read book", dueDate: nil, priority: "low")
        ]
    }
}
