import SwiftUI
import SwiftData

struct TasksView: View {
    @Query var tasks: [TaskItem]

    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Today")) {
                    ForEach(tasks.filter { task in
                        if let due = task.dueDate {
                            return Calendar.current.isDateInToday(due)
                        }
                        return false
                    }) { task in
                        TaskRow(task: task)
                    }
                }

                Section(header: Text("Upcoming")) {
                    ForEach(tasks.filter { task in
                        if let due = task.dueDate {
                            return due > Date() && !Calendar.current.isDateInToday(due)
                        }
                        return false
                    }) { task in
                        TaskRow(task: task)
                    }
                }

                Section(header: Text("Someday")) {
                    ForEach(tasks.filter { task in task.dueDate == nil }) { task in
                        TaskRow(task: task)
                    }
                }
            }
            .navigationTitle("Tasks")
        }
    }
}

struct TaskRow: View {
    var task: TaskItem

    var priorityColor: Color {
        switch task.priority.lowercased() {
        case "high": return .red
        case "medium": return .yellow
        case "low": return .green
        default: return .gray
        }
    }

    var body: some View {
        HStack {
            Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                .foregroundColor(task.completed ? .green : .gray)

            VStack(alignment: .leading) {
                Text(task.title)
                    .font(.headline)
                    .strikethrough(task.completed, color: .gray)
                if let due = task.dueDate {
                    Text(due, style: .date)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Circle()
                .fill(priorityColor)
                .frame(width: 10, height: 10)
        }
    }
}
