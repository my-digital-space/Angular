/**
 * Raw DTO returned by external REST API (snake_case, amounts in paise)
 */
export interface RawOrderDto {
  ord_id: string;
  cust_full_name: string;
  total_in_paise: number;
  created_epoch_ms: number;
  order_status_code: 'COMP' | 'PEND' | 'FAIL';
}

/**
 * Clean UI Domain Model used across Angular Components
 */
export interface UiOrder {
  id: string;
  customerName: string;
  totalInRupees: number;
  formattedDate: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'danger';
}

/**
 * Pure Adapter Function: RawOrderDto -> UiOrder
 * 
 * Isolates data transformation logic so if the backend changes
 * 'cust_full_name' to 'client_name', only this single function changes!
 */
export function adaptRawOrderToUi(dto: RawOrderDto): UiOrder {
  const statusMap: Record<RawOrderDto['order_status_code'], { label: string; color: 'success' | 'warning' | 'danger' }> = {
    COMP: { label: 'Completed', color: 'success' },
    PEND: { label: 'Pending Payment', color: 'warning' },
    FAIL: { label: 'Failed Transaction', color: 'danger' }
  };

  const statusInfo = statusMap[dto.order_status_code] || { label: 'Unknown', color: 'warning' };

  return {
    id: dto.ord_id,
    customerName: dto.cust_full_name.trim(),
    totalInRupees: dto.total_in_paise / 100,
    formattedDate: new Date(dto.created_epoch_ms).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    statusLabel: statusInfo.label,
    statusColor: statusInfo.color
  };
}
