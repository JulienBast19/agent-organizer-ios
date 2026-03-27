import SwiftUI

struct CalendarView: View {
    @State private var selectedDate = Date()
    @State private var events: [CalendarItem] = [
        CalendarItem(id: UUID(), title: "Team meeting", startDate: Calendar.current.date(byAdding: .day, value: 1, to: Date())!, endDate: Calendar.current.date(byAdding: .day, value: 1, to: Date())!, allDay: false),
        CalendarItem(id: UUID(), title: "Dentist appointment", startDate: Calendar.current.date(byAdding: .day, value: 3, to: Date())!, endDate: Calendar.current.date(byAdding: .day, value: 3, to: Date())!, allDay: false)
    ]

    var body: some View {
        NavigationView {
            VStack {
                DatePicker("Select Date", selection: $selectedDate, displayedComponents: [.date])
                    .datePickerStyle(.graphical)
                    .padding()

                List {
                    ForEach(eventsForSelectedDate) { event in
                        VStack(alignment: .leading) {
                            Text(event.title)
                                .font(.headline)
                            Text(event.startDate, style: .time)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Calendar")
        }
    }

    var eventsForSelectedDate: [CalendarItem] {
        events.filter { Calendar.current.isDate($0.startDate, inSameDayAs: selectedDate) }
    }
}
