import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DiskHealthIndicator, DNSHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator } from "@nestjs/terminus";



@ApiTags("health check")
@Controller("health")
export class HealthController{
    constructor(
        protected readonly health: HealthCheckService,
        protected readonly dns: DNSHealthIndicator,
        protected readonly memory: MemoryHealthIndicator,
        protected readonly disk: DiskHealthIndicator
    ) { }


    @HealthCheck()
    @Get("/readiness")
    readiness() {
        return this.health.check([
            () => this.dns.pingCheck("nts-connection-check", "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index.xml"),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            // () => this.disk.checkStorage('storage', { threshold: 250 * 1024 * 1024 * 1024, path: '/' })
        ])
    }
}