import SwiftUI
import SwiftData

struct ChatHomeView: View {
    @Environment(\.modelContext) private var modelContext

    @State private var message = ""
    @State private var entries: [ChatEntry] = [
        ChatEntry(
            text: "Start capturing reminders. For now, every message becomes a task.",
            role: .assistant,
            status: nil
        )
    ]

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    ForEach(entries) { entry in
                        ChatBubble(entry: entry)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
            }

            HStack {
                TextField("Write a reminder...", text: $message)
                    .textFieldStyle(.plain)
                    .padding(12)
                    .background(Color(.systemBackground).opacity(0.1))
                    .cornerRadius(8)
                    .submitLabel(.send)
                    .onSubmit(sendMessage)

                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .font(.title2)
                        .padding(10)
                }
                .disabled(trimmedMessage.isEmpty)
                .buttonStyle(.plain)
                .glassEffect(.regular.tint(.blue).interactive(), in: .circle)
            }
            .padding()
            .glassEffect(.regular, in: .rect(cornerRadius: .containerConcentric))
        }
        .navigationTitle("Chat")
    }

    private var trimmedMessage: String {
        message.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func sendMessage() {
        let trimmedMessage = trimmedMessage
        guard !trimmedMessage.isEmpty else { return }

        entries.append(ChatEntry(text: trimmedMessage, role: .user, status: nil))

        let task = TaskItem(title: trimmedMessage)
        modelContext.insert(task)
        TaskNotificationManager.shared.syncNotification(for: task)

        entries.append(
            ChatEntry(
                text: "Saved as a task.",
                role: .assistant,
                status: "Tasks"
            )
        )

        message = ""
    }
}

private struct ChatEntry: Identifiable {
    enum Role {
        case user
        case assistant
    }

    let id = UUID()
    let text: String
    let role: Role
    let status: String?
}

private struct ChatBubble: View {
    let entry: ChatEntry

    var body: some View {
        VStack(alignment: entry.role == .user ? .trailing : .leading, spacing: 6) {
            Text(entry.text)
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity, alignment: entry.role == .user ? .trailing : .leading)
                .background(bubbleColor)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            if let status = entry.status {
                Text(status)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: entry.role == .user ? .trailing : .leading)
    }

    private var bubbleColor: Color {
        switch entry.role {
        case .user:
            return .blue.opacity(0.16)
        case .assistant:
            return Color(.secondarySystemBackground)
        }
    }
}

struct ChatHomeView_Previews: PreviewProvider {
    static var previews: some View {
        ChatHomeView()
    }
}
