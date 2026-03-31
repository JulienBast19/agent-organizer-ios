import Foundation
import SwiftData

@Model
class TaskItem {
    var recordID: String
    var title: String
    var dueDate: Date?
    var priority: String
    var completed: Bool
    var notes: String?
    var notificationID: String

    init(
        recordID: String = UUID().uuidString,
        title: String,
        dueDate: Date? = nil,
        priority: String = "medium",
        completed: Bool = false,
        notes: String? = nil,
        notificationID: String = UUID().uuidString
    ) {
        self.recordID = recordID
        self.title = title
        self.dueDate = dueDate
        self.priority = priority
        self.completed = completed
        self.notes = notes
        self.notificationID = notificationID
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
