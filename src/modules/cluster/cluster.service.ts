import { Cluster } from 'cluster';
import { Injectable, Logger } from '@nestjs/common';

const cluster: Cluster = require('cluster');

@Injectable()
export class ClusterService {
  private static readonly logger = new Logger('ClusterService');
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      console.log();
      this.logger.log(`Primary server started on ${process.pid}`);
      for (let i = 0; i < 3; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log();
        this.logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });
    } else {
      this.logger.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
