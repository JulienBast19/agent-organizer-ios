import Foundation
import SwiftData

@Model
class CalendarItem {
    var recordID: String
    var title: String
    var startDate: Date
    var endDate: Date
    var allDay: Bool
    var notes: String?
    var location: String?

    init(recordID: String = UUID().uuidString, title: String, startDate: Date = Date(), endDate: Date = Date(), allDay: Bool = false, notes: String? = nil, location: String? = nil) {
        self.recordID = recordID
        self.title = title
        self.startDate = startDate
        self.endDate = endDate
        self.allDay = allDay
        self.notes = notes
        self.location = location
    }
}

extension CalendarItem {
    static var sampleEvents: [CalendarItem] {
        [
            CalendarItem(title: "Team Meeting", startDate: Date(), endDate: Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date(), allDay: false, notes: "Discuss project", location: "Conference Room"),
            CalendarItem(title: "All Day Conference", startDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()), endDate: Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()), allDay: true, notes: "Annual conference", location: nil)
        ]
    }
}
