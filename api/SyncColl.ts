import { Coll } from './Coll';
import { ModelBase, ModelCreate, ModelUpdate } from './models';
import { IMsgReadonly, Msg } from '../helpers/Msg';
import { byId, Dict, first, isEmpty, List } from '../helpers';

export interface Todo<T extends ModelBase> {
  id: string;
  from?: T;
  create?: ModelCreate<T>;
  update?: ModelUpdate<T>;
  delete?: boolean;
  started?: number;
  error?: Error;
}

export class SyncColl<T extends ModelBase> {
  public coll: Coll<T>;
  
  public dict$: Msg<Dict<T>>;
  public list$: IMsgReadonly<List<T>>;

  private todo$: Msg<Record<string, Todo<T>>>;
  private isInit = false;
  private isFlush = false;
  private interval?: any;

  constructor(collName: string, key?: string) {
    this.coll = new Coll<T>(collName);

    this.dict$ = new Msg<Record<string, T>>({}, key, true);
    this.list$ = this.dict$.map(Object.values) as IMsgReadonly<T[]>;

    this.todo$ = new Msg<Record<string, Todo<T>>>({});
    this.todo$.throttle(this.flush.bind(this));
  }

  async load(): Promise<void> {
    await this.flush();
    const list = await this.coll.find({});
    const dict = byId(list);
    this.dict$.set(dict);
  }

  async flush(): Promise<void> {
    if (this.isFlush) return;

    const todos = Object.values(this.todo$.v).filter(t => !t.error && !t.started);
    if (isEmpty(todos)) return;

    const todo = { ...first(todos), started: Date.now() };
    this.todo$.merge({ [todo.id]: todo });

    try {
      this.isFlush = true;


    }
    catch (error) {
      todo.error = error;

      throw error;
    }
    finally {
      this.isFlush = false;
    }
    





    for (const id of todoDict) {
      const todo = todoDict[id];




      const created = await this.coll.create(curr as ModelCreate<T>);
    
    // Mettre à jour l'état local
    this.updateState(id, {
      curr: created,
      remote: created
    });
    }





    const states = this.items$.v;
    const operations: Promise<void>[] = [];

    for (const [id, state] of Object.entries(states)) {
      const { curr, remote } = state;

      try {
        if (remote === null && curr !== null) {
          // CREATE: item local sans équivalent distant
          operations.push(this.handleCreate(id, curr, state));
          
        } else if (curr === null && remote !== null) {
          // DELETE: item distant sans équivalent local
          operations.push(this.handleDelete(id, remote, state));
          
        } else if (curr !== null && remote !== null && this.hasChanged(curr, remote)) {
          // UPDATE: items différents entre local et distant
          operations.push(this.handleUpdate(id, curr, remote, state));
        }
        // Si curr === remote, rien à faire
        
      } catch (error) {
        console.error(`SyncColl flush error for item ${id}:`, error);
        // Continue avec les autres items même si un échoue
      }
    }

    // Attendre toutes les opérations
    await Promise.all(operations);
  }

  private async handleDelete(id: string, remote: T, state: SyncState<T>): Promise<void> {
    console.debug('SyncColl DELETE:', id, remote);
    
    // Supprimer l'item côté distant
    await this.coll.delete(remote.id);
    
    // Supprimer de l'état local
    this.removeState(id);
  }

  private async handleUpdate(id: string, curr: T, remote: T, state: SyncState<T>): Promise<void> {
    console.debug('SyncColl UPDATE:', id, curr, remote);
    
    // Calculer les différences
    const changes = this.getChanges(remote, curr);
    
    if (Object.keys(changes).length > 0) {
      // Appliquer les changements côté distant
      const updated = await this.coll.update(remote.id, changes);
      
      if (updated) {
        // Mettre à jour l'état local
        this.updateState(id, {
          curr: updated,
          remote: updated
        });
      }
    }
  }

  /**
   * Détermine si deux items ont des différences
   */
  private hasChanged(curr: T, remote: T): boolean {
    // Comparaison simple par JSON - à améliorer selon les besoins
    return JSON.stringify(curr) !== JSON.stringify(remote);
  }

  /**
   * Calcule les différences entre remote et curr
   */
  private getChanges(remote: T, curr: T): ModelUpdate<T> {
    const changes: any = {};
    
    // Comparer chaque propriété
    for (const key in curr) {
      if (curr[key] !== remote[key]) {
        changes[key] = curr[key];
      }
    }
    
    return changes;
  }

  /**
   * Met à jour un état spécifique
   */
  private updateState(id: string, newState: SyncState<T>): void {
    const states = { ...this.items$.v };
    states[id] = newState;
    this.items$.set(states);
  }

  /**
   * Supprime un état spécifique
   */
  private removeState(id: string): void {
    const states = { ...this.items$.v };
    delete states[id];
    this.items$.set(states);
  }

  /**
   * API de convenance pour modifier un item local
   */
  setLocal(id: string, item: T): void {
    const states = this.items$.v;
    const existingState = states[id];
    
    this.updateState(id, {
      curr: item,
      remote: existingState?.remote || null
    });
  }

  /**
   * API de convenance pour supprimer un item local
   */
  deleteLocal(id: string): void {
    const states = this.items$.v;
    const existingState = states[id];
    
    if (existingState) {
      this.updateState(id, {
        curr: null,
        remote: existingState.remote
      });
    }
  }

  /**
   * Obtient la liste des items actuels (version curr)
   */
  getCurrentItems(): T[] {
    const states = this.items$.v;
    return Object.values(states)
      .map(state => state.curr)
      .filter(item => item !== null) as T[];
  }

  /**
   * Obtient la liste des items distants (version remote)
   */
  getRemoteItems(): T[] {
    const states = this.items$.v;
    return Object.values(states)
      .map(state => state.remote)
      .filter(item => item !== null) as T[];
  }

  /**
   * Initialise la SyncColl avec l'écoute temps réel et charge toutes les données
   * Ne fait rien si déjà initialisée
   */
  async init(): Promise<void> {
    if (this.isInit) return;
    
    console.debug('SyncColl init');
    
    try {
      await this.load();
      await this.coll.subscribe('*', this.onEvent.bind(this));
      
      // Synchronisation automatique toutes les minutes
      this.syncInterval = setInterval(() => {
        this.flush().catch(error => {
          console.error('SyncColl auto-sync error:', error);
        });
      }, 60 * 1000);
      
      this.isInit = true;
    } catch (error) {
      console.error('SyncColl init error:', error);
      throw error;
    }
  }

  /**
   * Gère les événements temps réel
   */
  private onEvent(item: T, action: 'update' | 'create' | 'delete'): void {
    const states = this.items$.v;
    const id = item.id;
    const existingState = states[id];

    let newState: SyncState<T>;

    switch (action) {
      case 'create':
      case 'update':
        // Mettre à jour la version remote avec les données reçues
        newState = {
          curr: existingState?.curr || null,
          remote: item
        };
        break;

      case 'delete':
        // Marquer comme supprimé côté distant
        newState = {
          curr: existingState?.curr || null,
          remote: null
        };
        break;

      default:
        console.warn('SyncColl unknown realtime action:', action);
        return;
    }

    this.updateState(id, newState);
  }


  /**
   * Vide le cache local
   */
  clear(): void {
    this.items$.set({});
  }

  /**
   * Dispose la SyncColl (vide le cache et arrête la sync auto)
   */
  dispose(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    this.clear();
    this.isInit = false;
  }
}