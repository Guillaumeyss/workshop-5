import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { NodeState, Value } from "../types";

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

 

  // TODO implement this
  // this route allows retrieving the current status of the node
   node.get("/status", (req, res) => {
      if(isFaulty){
        nodeState.x=null;
        nodeState.decided=null;
        nodeState.k=null;
        res.status(500).send("faulty");

      }
      else {
        res.status(200).send("live");
      }
   });
   

   // Node state
let nodeState: NodeState = {
  killed: false,
  x: initialValue,
  decided: null,
  k: null
};

 // This route allows the node to receive messages from other nodes
node.post("/message", (req, res) => {
  // TODO: Process the received message according to the Ben-Or algorithm
  
  res.status(200).send("Message received");
});

// This route is used to start the consensus algorithm
node.get("/start", async (req, res) => {
  // TODO: Start the consensus algorithm
  while(!nodesAreReady()){
    await new Promise((r) => setTimeout(r, 1000));
  }
  nodeState.k = 0;
  res.status(200).send("Consensus algorithm started");
  
});

// This route is used to stop the consensus algorithm
node.get("/stop", async (req, res) => {
  // Stop the consensus algorithm
  nodeState.killed = true;
  res.status(200).send("Consensus algorithm stopped");
});

// Get the current state of a node
node.get("/getState", (req, res) => {
  res.status(200).json(nodeState);
});

  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
