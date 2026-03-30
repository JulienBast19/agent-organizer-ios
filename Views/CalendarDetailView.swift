import SwiftUI
import SwiftData

struct CalendarDetailView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Bindable var event: CalendarItem

    var body: some View {
        Form {
            Section("Details") {
                TextField("Title", text: $event.title)

                Toggle("All Day", isOn: $event.allDay)

                DatePicker(
                    "Start",
                    selection: $event.startDate,
                    displayedComponents: event.allDay ? [.date] : [.date, .hourAndMinute]
                )

                DatePicker(
                    "End",
                    selection: $event.endDate,
                    displayedComponents: event.allDay ? [.date] : [.date, .hourAndMinute]
                )
            }

            Section("Context") {
                TextField("Location", text: Binding(
                    get: { event.location ?? "" },
                    set: { event.location = $0.isEmpty ? nil : $0 }
                ))

                TextField("Notes", text: Binding(
                    get: { event.notes ?? "" },
                    set: { event.notes = $0.isEmpty ? nil : $0 }
                ), axis: .vertical)
                .lineLimit(3...6)
            }

            Section {
                Button("Delete Event", role: .destructive) {
                    modelContext.delete(event)
                    dismiss()
                }
            }
        }
        .navigationTitle("Event Details")
        .navigationBarTitleDisplayMode(.inline)
        .onChange(of: event.startDate) {
            if event.endDate < event.startDate {
                event.endDate = event.startDate
            }
        }
        .onChange(of: event.allDay) {
            if event.allDay {
                let calendar = Calendar.current
                event.startDate = calendar.startOfDay(for: event.startDate)
                event.endDate = calendar.startOfDay(for: max(event.endDate, event.startDate))
            }
        }
    }
}
