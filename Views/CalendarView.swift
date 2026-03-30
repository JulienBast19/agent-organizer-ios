import SwiftUI
import SwiftData

struct CalendarView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var selectedDate = Date()
    @State private var newEventTitle = ""
    @Query var events: [CalendarItem]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                DatePicker("Select Date", selection: $selectedDate, displayedComponents: [.date])
                    .datePickerStyle(.graphical)
                    .padding()

                List {
                    addEventSection

                    eventSection("Selected Day", events: eventsForSelectedDate, emptyText: "No events on this day.")
                    eventSection("Upcoming", events: upcomingEvents, emptyText: "No upcoming events.")
                }
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Calendar")
        }
    }

    private var addEventSection: some View {
        Section("Add Event") {
            HStack(spacing: 12) {
                TextField("What is happening?", text: $newEventTitle)
                    .textInputAutocapitalization(.sentences)
                    .submitLabel(.done)
                    .onSubmit(addEvent)

                Button(action: addEvent) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                }
                .disabled(trimmedNewEventTitle.isEmpty)
            }
        }
    }

    @ViewBuilder
    private func eventSection(_ title: String, events: [CalendarItem], emptyText: String) -> some View {
        Section(title) {
            if events.isEmpty {
                Text(emptyText)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(events) { event in
                    NavigationLink(destination: CalendarDetailView(event: event)) {
                        EventRow(event: event)
                    }
                }
                .onDelete { offsets in
                    deleteEvents(at: offsets, from: events)
                }
            }
        }
    }

    private var sortedEvents: [CalendarItem] {
        events.sorted { $0.startDate < $1.startDate }
    }

    private var trimmedNewEventTitle: String {
        newEventTitle.trimmingCharacters(in: .whitespacesAndNewlines)
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

    private func addEvent() {
        let title = trimmedNewEventTitle
        guard !title.isEmpty else { return }

        let startDate = defaultEventStartDate()
        let endDate = Calendar.current.date(byAdding: .hour, value: 1, to: startDate) ?? startDate.addingTimeInterval(3600)
        modelContext.insert(CalendarItem(title: title, startDate: startDate, endDate: endDate))
        newEventTitle = ""
    }

    private func defaultEventStartDate() -> Date {
        let calendar = Calendar.current
        let nextHour = calendar.nextDate(
            after: max(Date(), selectedDate),
            matching: DateComponents(minute: 0),
            matchingPolicy: .nextTime
        )

        return nextHour ?? Date().addingTimeInterval(3600)
    }

    private func deleteEvents(at offsets: IndexSet, from sectionEvents: [CalendarItem]) {
        for index in offsets {
            modelContext.delete(sectionEvents[index])
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
