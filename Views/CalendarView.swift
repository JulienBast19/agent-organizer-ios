import SwiftUI
import SwiftData

struct CalendarView: View {
    @State private var selectedDate = Date()
    @Query var events: [CalendarItem]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                DatePicker("Select Date", selection: $selectedDate, displayedComponents: [.date])
                    .datePickerStyle(.graphical)
                    .padding()

                List {
                    Section("Selected Day") {
                        if eventsForSelectedDate.isEmpty {
                            Text("No events on this day.")
                                .foregroundStyle(.secondary)
                        } else {
                            ForEach(eventsForSelectedDate) { event in
                                EventRow(event: event)
                            }
                        }
                    }

                    Section("Upcoming") {
                        if upcomingEvents.isEmpty {
                            Text("No upcoming events.")
                                .foregroundStyle(.secondary)
                        } else {
                            ForEach(upcomingEvents) { event in
                                EventRow(event: event)
                            }
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Calendar")
        }
    }

    private var sortedEvents: [CalendarItem] {
        events.sorted { $0.startDate < $1.startDate }
    }

    private var eventsForSelectedDate: [CalendarItem] {
        sortedEvents.filter { item in
            Calendar.current.isDate(item.startDate, inSameDayAs: selectedDate)
        }
    }

    private var upcomingEvents: [CalendarItem] {
        sortedEvents.filter { item in
            item.startDate > Date() && !Calendar.current.isDate(item.startDate, inSameDayAs: selectedDate)
        }
    }
}

private struct EventRow: View {
    let event: CalendarItem

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(event.title)
                .font(.headline)

            Text(timeText)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            if let location = event.location, !location.isEmpty {
                Text(location)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }

    private var timeText: String {
        if event.allDay {
            return "All day"
        }

        return "\(event.startDate.formatted(date: .abbreviated, time: .shortened)) - \(event.endDate.formatted(date: .omitted, time: .shortened))"
    }
}
