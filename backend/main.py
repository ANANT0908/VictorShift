from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Allow requests from React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    nodes = pipeline.nodes
    edges = pipeline.edges
    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag = check_is_dag(nodes, edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}

def check_is_dag(nodes, edges):
    """Return True if the graph formed by nodes+edges is a DAG (no cycles)."""
    node_ids = {n['id'] for n in nodes}
    # Build adjacency list
    adj = {nid: [] for nid in node_ids}
    for edge in edges:
        src = edge.get('source')
        tgt = edge.get('target')
        if src in adj and tgt in node_ids:
            adj[src].append(tgt)
    
    # DFS cycle detection
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {nid: WHITE for nid in node_ids}

    def dfs(u):
        color[u] = GRAY
        for v in adj[u]:
            if color[v] == GRAY:
                return False  # back edge = cycle
            if color[v] == WHITE and not dfs(v):
                return False
        color[u] = BLACK
        return True

    for nid in node_ids:
        if color[nid] == WHITE:
            if not dfs(nid):
                return False
    return True
