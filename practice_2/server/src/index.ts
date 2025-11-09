import { Server, ServerCredentials } from "@grpc/grpc-js";
import { ChatServiceService } from "../../.generated/ChatService_grpc_pb";
import { addReflection } from "grpc-server-reflection";

// implementation for chat service.
function chat(call) {
  // this event is fired every time there is new data.
  call.on("data", (ChatMessage) => {
    const message = ChatMessage.getMessage();
    console.log(message);
    const user = call.metadata.get("username");
    console.log(user);
  });

  // this event is fired when all data has been read.
  call.on("end", () => {
    call.end();
  });
}

function getServer() {
  const server = new Server();

  // Reflection is needed for reading list of service from the client.
  // ref. https://syfm.hatenablog.com/entry/2020/06/23/235952
  addReflection(server, "./.generated/descriptor_set.bin");

  // add service and mapping the implemented function.
  server.addService(ChatServiceService, {
    chat: chat,
  });

  // starting server.
  server.bindAsync(
    "localhost:50051",
    ServerCredentials.createInsecure(),
    () => {
      console.log("server start");
    }
  );
}

getServer();
