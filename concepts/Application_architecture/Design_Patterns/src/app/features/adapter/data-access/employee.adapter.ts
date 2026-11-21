/**
 * Raw Legacy Employee DTO from Backend API
 */
export interface EmployeeApiDto {
  emp_id: number;
  full_nm: string;
  is_active_flag: 'Y' | 'N';
  dept_code: string;
  salary_cents: number;
}

/**
 * Clean UI Model consumed by Angular Components
 */
export interface Employee {
  id: number;
  name: string;
  isActive: boolean;
  department: string;
  monthlySalaryUsd: number;
  initials: string;
}

/**
 * Pure Adapter Function: EmployeeApiDto -> Employee
 */
export function adaptEmployee(dto: EmployeeApiDto): Employee {
  const trimmedName = dto.full_nm ? dto.full_nm.trim() : 'Unknown';
  const nameParts = trimmedName.split(' ');
  const initials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : trimmedName.slice(0, 2).toUpperCase();

  const deptMap: Record<string, string> = {
    ENG: 'Engineering & DevOps',
    DES: 'Product Design (UX/UI)',
    MKT: 'Growth Marketing',
    FIN: 'Finance & Compliance'
  };

  return {
    id: dto.emp_id,
    name: trimmedName,
    isActive: dto.is_active_flag === 'Y',
    department: deptMap[dto.dept_code] || dto.dept_code || 'General Staff',
    monthlySalaryUsd: Math.round(dto.salary_cents / 100),
    initials
  };
}
