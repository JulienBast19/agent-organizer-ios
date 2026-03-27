import SwiftUI
import SwiftData

struct CalendarView: View {
    @State private var selectedDate = Date()
    @Query var events: [CalendarItem]
    
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
        events.filter { item in
            Calendar.current.isDate(item.startDate, inSameDayAs: selectedDate)
        }
    }
}
