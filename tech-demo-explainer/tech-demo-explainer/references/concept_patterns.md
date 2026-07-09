# Concept-to-Demo Pattern Mapping

Use this reference to pick the right demo shape for a given technology concept.

## Load Balancer（负载均衡）

**Goal**: Show how requests are distributed across multiple backend servers.
**Demo shape**: Interactive simulation.
**Key elements**:
- A "client" firing requests.
- Multiple "server" boxes with capacity/health indicators.
- An algorithm selector: round-robin, least-connections, random.
- A start/stop button to visualize traffic distribution.
**What the user learns**: Different algorithms produce different distribution patterns; health checks remove failed nodes.

## Kubernetes / Container Orchestration

**Goal**: Show why containers need scheduling and self-healing.
**Demo shape**: Cluster simulation.
**Key elements**:
- A master node and several worker nodes.
- Pods as movable units.
- A slider for "desired replicas".
- Click a worker to "fail" it and watch pods reschedule.
**What the user learns**: K8s maintains desired state automatically.

## Model Deployment（模型部署）

**Goal**: Show how an ML model goes from artifact to serving endpoint.
**Demo shape**: Pipeline visualization.
**Key elements**:
- Stages: train → package → deploy → serve → scale.
- A traffic slider to show autoscaling.
- Latency/cost counters.
**What the user learns**: Deployment is about packaging, exposing an API, and handling traffic.

## TypeScript

**Goal**: Show the difference between dynamic and static typing.
**Demo shape**: Side-by-side editor comparison.
**Key elements**:
- Two code panels: JavaScript vs TypeScript.
- Type an invalid operation and see TS catch it immediately.
- Output panel showing runtime error vs compile-time error.
**What the user learns**: TypeScript catches mistakes before running the code.

## API / REST

**Goal**: Show how clients talk to servers through HTTP verbs.
**Demo shape**: Request builder.
**Key elements**:
- Method selector (GET/POST/PUT/DELETE).
- Endpoint input.
- Simulated server response with status code.
**What the user learns**: HTTP methods map to CRUD operations.

## Database Index

**Goal**: Show why indexes speed up queries.
**Demo shape**: Table scan race.
**Key elements**:
- A table with many rows.
- Query input.
- Toggle index on/off and compare search steps.
**What the user learns**: Indexes reduce the number of rows to inspect.

## Caching

**Goal**: Show the trade-off between speed and freshness.
**Demo shape**: Cache hit/miss visualization.
**Key elements**:
- Client, cache layer, origin server.
- TTL slider.
- Hit/miss counters and latency display.
**What the user learns**: Cache speeds up repeated reads but can serve stale data.

## Message Queue

**Goal**: Show how async processing decouples systems.
**Demo shape**: Producer-consumer pipeline.
**Key elements**:
- Producers generating tasks.
- A queue that buffers tasks.
- Consumers pulling tasks at different speeds.
**What the user learns**: Queues smooth out traffic spikes and decouple producers from consumers.
