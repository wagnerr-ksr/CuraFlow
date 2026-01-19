/**
 * Unified DB Adapter
 * 
 * Automatically uses Railway or Base44 based on environment configuration
 */

import { Base44Adapter } from './Base44Adapter';
import { RailwayAdapter } from './RailwayAdapter';

const USE_RAILWAY = import.meta.env.VITE_USE_RAILWAY === 'true';

export function createDbAdapter(entityName) {
  if (USE_RAILWAY) {
    console.log(`Using Railway adapter for ${entityName}`);
    return new RailwayAdapter(entityName);
  } else {
    console.log(`Using Base44 adapter for ${entityName}`);
    return new Base44Adapter(entityName);
  }
}

// For backward compatibility
export class UnifiedAdapter {
  constructor(entityName) {
    this.adapter = createDbAdapter(entityName);
  }

  list(sort, limit) {
    return this.adapter.list(sort, limit);
  }

  filter(query, sort, limit) {
    return this.adapter.filter(query, sort, limit);
  }

  get(id) {
    return this.adapter.get(id);
  }

  create(data) {
    return this.adapter.create(data);
  }

  update(id, data) {
    return this.adapter.update(id, data);
  }

  delete(id) {
    return this.adapter.delete(id);
  }

  bulkCreate(data) {
    return this.adapter.bulkCreate(data);
  }
}
