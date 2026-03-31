import Foundation
import UserNotifications

@MainActor
final class TaskNotificationManager {
    static let shared = TaskNotificationManager()

    private init() {}

    func syncNotification(for task: TaskItem) {
        Task {
            let center = UNUserNotificationCenter.current()
            let granted = await requestAuthorizationIfNeeded(using: center)

            guard granted else {
                center.removePendingNotificationRequests(withIdentifiers: [task.notificationID])
                return
            }

            guard
                let dueDate = task.dueDate,
                dueDate > Date(),
                !task.completed
            else {
                center.removePendingNotificationRequests(withIdentifiers: [task.notificationID])
                return
            }

            let content = UNMutableNotificationContent()
            content.title = "Task Reminder"
            content.body = task.title
            content.sound = .default

            let interval = dueDate.timeIntervalSinceNow
            let trigger = UNTimeIntervalNotificationTrigger(
                timeInterval: max(interval, 1),
                repeats: false
            )

            let request = UNNotificationRequest(
                identifier: task.notificationID,
                content: content,
                trigger: trigger
            )

            center.removePendingNotificationRequests(withIdentifiers: [task.notificationID])

            do {
                try await center.add(request)
            } catch {
                print("Failed to schedule notification: \(error.localizedDescription)")
            }
        }
    }

    func removeNotification(for task: TaskItem) {
        UNUserNotificationCenter.current()
            .removePendingNotificationRequests(withIdentifiers: [task.notificationID])
    }

    private func requestAuthorizationIfNeeded(using center: UNUserNotificationCenter) async -> Bool {
        let settings = await center.notificationSettings()

        switch settings.authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return true
        case .notDetermined:
            do {
                return try await center.requestAuthorization(options: [.alert, .badge, .sound])
            } catch {
                print("Failed to request notifications: \(error.localizedDescription)")
                return false
            }
        case .denied:
            return false
        @unknown default:
            return false
        }
    }
}
