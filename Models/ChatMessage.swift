import Foundation
import SwiftData

@Model
class ChatMessage {
    var text: String
    var role: String
    var status: String?
    var createdAt: Date
    var linkedKind: String?
    var linkedRecordID: String?
    var linkedTitle: String?

    init(
        text: String,
        role: String,
        status: String? = nil,
        createdAt: Date = Date(),
        linkedKind: String? = nil,
        linkedRecordID: String? = nil,
        linkedTitle: String? = nil
    ) {
        self.text = text
        self.role = role
        self.status = status
        self.createdAt = createdAt
        self.linkedKind = linkedKind
        self.linkedRecordID = linkedRecordID
        self.linkedTitle = linkedTitle
    }
}
