import SwiftUI
import SwiftData

@main
struct AgentOrganizerApp: App {
    var body: some Scene {
        WindowGroup {
            MainTabView()
        }
        .modelContainer(for: [TaskItem.self, CalendarItem.self, ChatMessage.self])
    }
}
