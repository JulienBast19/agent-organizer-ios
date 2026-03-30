import Foundation

struct OrganizedDraft: Decodable {
    let kind: DraftKind
    let title: String
    let priority: String?
    let dueDate: String?
    let startDate: String?
    let endDate: String?
    let allDay: Bool?
    let location: String?
    let notes: String?
    let explanation: String?
}

enum DraftKind: String, Decodable {
    case task
    case event
}

enum AIOrganizerError: LocalizedError {
    case invalidResponse
    case emptyResponse

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "The AI response could not be understood."
        case .emptyResponse:
            return "The AI response was empty."
        }
    }
}

struct AIOrganizerService {
    private let session: URLSession
    private let model = "gpt-5.4-mini"

    init(session: URLSession = .shared) {
        self.session = session
    }

    func organize(message: String, apiKey: String, now: Date = Date(), timeZone: TimeZone = .current) async throws -> OrganizedDraft {
        let requestBody = ResponsesRequest(
            model: model,
            input: [
                .init(
                    role: "system",
                    content: [
                        .init(
                            type: "input_text",
                            text: systemPrompt(now: now, timeZone: timeZone)
                        )
                    ]
                ),
                .init(
                    role: "user",
                    content: [
                        .init(type: "input_text", text: message)
                    ]
                )
            ],
            text: .init(
                format: .init(type: "json_object")
            )
        )

        var request = URLRequest(url: URL(string: "https://api.openai.com/v1/responses")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONEncoder().encode(requestBody)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, (200..<300).contains(httpResponse.statusCode) else {
            throw AIOrganizerError.invalidResponse
        }

        let decoded = try JSONDecoder().decode(ResponsesEnvelope.self, from: data)

        guard let text = decoded.outputText, !text.isEmpty else {
            throw AIOrganizerError.emptyResponse
        }

        let textData = Data(text.utf8)
        return try JSONDecoder().decode(OrganizedDraft.self, from: textData)
    }

    private func systemPrompt(now: Date, timeZone: TimeZone) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]

        return """
        You convert a single user message into either a task or a calendar event.

        Current timestamp: \(formatter.string(from: now))
        User timezone: \(timeZone.identifier)

        Return a JSON object with exactly these keys:
        - kind: "task" or "event"
        - title: string
        - priority: "low", "medium", "high", or null
        - dueDate: RFC3339 datetime string or null
        - startDate: RFC3339 datetime string or null
        - endDate: RFC3339 datetime string or null
        - allDay: boolean or null
        - location: string or null
        - notes: string or null
        - explanation: short string

        Rules:
        - Prefer "task" when scheduling information is missing or ambiguous.
        - Use "event" only when the message clearly implies something scheduled or happening at a time.
        - For tasks, keep startDate and endDate null.
        - For events, provide startDate. If duration is missing, set endDate to one hour after startDate.
        - Use null for unknown optional fields.
        - Keep title concise and action-oriented.
        - Do not include markdown or extra text outside the JSON object.
        """
    }
}

private struct ResponsesRequest: Encodable {
    let model: String
    let input: [InputMessage]
    let text: TextConfig
}

private struct InputMessage: Encodable {
    let role: String
    let content: [InputContent]
}

private struct InputContent: Encodable {
    let type: String
    let text: String
}

private struct TextConfig: Encodable {
    let format: ResponseFormat
}

private struct ResponseFormat: Encodable {
    let type: String
}

private struct ResponsesEnvelope: Decodable {
    let output: [ResponseOutput]

    var outputText: String? {
        for item in output {
            guard item.type == "message" else { continue }
            for content in item.content where content.type == "output_text" {
                return content.text
            }
        }

        return nil
    }
}

private struct ResponseOutput: Decodable {
    let type: String
    let content: [ResponseContent]
}

private struct ResponseContent: Decodable {
    let type: String
    let text: String?
}
