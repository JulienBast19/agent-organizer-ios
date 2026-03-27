import Foundation

struct CalendarItem: Identifiable {
    let id: UUID = UUID()
    var title: String
    var startDate: Date
    var endDate: Date
    var allDay: Bool
    var notes: String?
    var location: String?
}

extension CalendarItem {
    static var sampleEvents: [CalendarItem] {
        [
            CalendarItem(
                title: "Team Meeting",
                startDate: Date(),
                endDate: Date().addingTimeInterval(3600),
                allDay: false,
                notes: "Discuss project",
                location: "Conference Room"
            ),
            CalendarItem(
                title: "All Day Conference",
                startDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()),
                endDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()),
                allDay: true,
                notes: "Annual conference",
                location: nil
            )
        ]
    }
}
