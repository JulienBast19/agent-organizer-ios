import SwiftUI
import SwiftData

struct TaskDetailView: View {
    @Environment(\.modelContext) private var context
  @@ObservedObject var task: TaskItem

    var body: some View {
        Form {
            Section(header: Text("Details")) {
                TextField("Title", text: $task.title)
                DatePicker("Due Date", selection: Binding(
                    get: { task.dueDate ?? Date() },
                    set: { task.dueDate = $0 }
                ), displayedComponents: [.date, .hourAndMinute])
                Picker("Priority", selection: $task.priority) {
                    Text("Low").tag("low")
                    Text("Medium").tag("medium")
                    Text("High").tag("high")
                }
                Toggle("Completed", isOn: $task.completed)
            }
            Section {
                Button("Delete Task", role: .destructive) {
                    context.delete(task)
                }
            }
        }
        .navigationTitle("Task Details")
    }
}
