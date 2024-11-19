class CustomerResponseDto {
  id: string;
  firstName: string;
  lastName: string;
}

class BusinessProfileResponseDto {
  id: string;
  businessName: string;
  businessAddress: string;
}
class ServiceResponseDto {
  id: string;
  serviceName: string;
  serviceType: string;
}

class StaffResponseDto {
  id: string;
}

export class AppointmentResponseDto {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  customer: CustomerResponseDto | null;
  businessProfile: BusinessProfileResponseDto;
  serviceDetails: ServiceResponseDto;
  assignedStaff: StaffResponseDto | null;
  customerEmail: string;
  customerName: string;
  customerPhoneNumber: string;
  status: string;
}
