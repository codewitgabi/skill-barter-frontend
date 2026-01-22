export interface IExchangeRequest {
  id: number;
  from: string;
  skill: string;
  wantsToLearn: string;
  message: string;
  avatar: string;
  time: string;
}

export interface ExchangeRequestsState {
  requests: Array<IExchangeRequest>;
  isLoading: boolean;
  processingIds: Set<number>;
}

export interface ExchangeRequestsActions {
  setRequests: (requests: Array<IExchangeRequest>) => void;
  addRequest: (request: IExchangeRequest) => void;
  removeRequest: (id: number) => void;
  addProcessingId: (id: number) => void;
  removeProcessingId: (id: number) => void;
  clearProcessingIds: () => void;
  setLoading: (loading: boolean) => void;
}

export type ExchangeRequestsStore = ExchangeRequestsState & ExchangeRequestsActions;
