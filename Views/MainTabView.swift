import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            ChatHomeView()
                .tabItem {
                    Label("Capture", systemImage: "bubble.left.and.bubble.right.fill")
                }
            TasksView()
                .tabItem {
                    Label("Tasks", systemImage: "checklist.checked")
                }
            CalendarView()
                .tabItem {
                    Label("Calendar", systemImage: "calendar.circle.fill")
                }
        }
        .tint(.blue)
    }
}

struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
    }
}
