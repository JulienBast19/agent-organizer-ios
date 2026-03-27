import SwiftUI

struct ChatHomeView: View {
    @State private var message: String = ""
    var body: some View {
        VStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Start capturing reminders...")
                        .padding(.vertical)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding()

            HStack {
                TextField("Write a reminder...", text: $message)
                    .textFieldStyle(.plain)
                    .padding(12)
                    .background(Color(.systemBackground).opacity(0.1))
                    .cornerRadius(8)

                Button {
                    // handle send
                    message = ""
                } label: {
                    Image(systemName: "paperplane.fill")
                        .font(.title2)
                        .padding(10)
                }
                .buttonStyle(.plain)
                .glassEffect(.regular.tint(.blue).interactive(), in: .circle)
            }
            .padding()
            .glassEffect(.regular, in: .rect(cornerRadius: .containerConcentric))
        }
        .navigationTitle("Chat")
    }
}

struct ChatHomeView_Previews: PreviewProvider {
    static var previews: some View {
        ChatHomeView()
    }
}
