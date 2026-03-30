import SwiftUI
import SwiftData

struct TaskDetailView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Bindable var task: TaskItem

    var body: some View {
        Form {
            Section("Details") {
                TextField("Title", text: $task.title)

                DatePicker(
                    "Due Date",
                    selection: Binding(
                        get: { task.dueDate ?? Date() },
                        set: { task.dueDate = $0 }
                    ),
                    displayedComponents: [.date, .hourAndMinute]
                )

                Button(task.dueDate == nil ? "Set Due Date to Now" : "Clear Due Date") {
                    if task.dueDate == nil {
                        task.dueDate = Date()
                    } else {
                        task.dueDate = nil
                    }
                }

                Picker("Priority", selection: $task.priority) {
                    Text("Low").tag("low")
                    Text("Medium").tag("medium")
                    Text("High").tag("high")
                }

                Toggle("Completed", isOn: $task.completed)
            }

            Section("Notes") {
                TextField("Notes", text: Binding(
                    get: { task.notes ?? "" },
                    set: { task.notes = $0.isEmpty ? nil : $0 }
                ), axis: .vertical)
                .lineLimit(3...6)
            }

            Section {
                Button("Delete Task", role: .destructive) {
                    TaskNotificationManager.shared.removeNotification(for: task)
                    modelContext.delete(task)
                    dismiss()
                }
            }
        }
        .navigationTitle("Task Details")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            TaskNotificationManager.shared.syncNotification(for: task)
        }
        .onChange(of: task.title) {
            TaskNotificationManager.shared.syncNotification(for: task)
        }
        .onChange(of: task.dueDate) {
            TaskNotificationManager.shared.syncNotification(for: task)
        }
        .onChange(of: task.completed) {
            TaskNotificationManager.shared.syncNotification(for: task)
        }
    }
}
