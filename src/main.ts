import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ClusterService } from './modules/cluster/cluster.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('BOOTSTRAP');
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000;
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(PORT, () =>
      logger.log(`Server started on ${PORT} port...`),
    );
  } catch (e) {
    logger.error(e);
    process.exit();
  }
}

ClusterService.clusterize(bootstrap);
