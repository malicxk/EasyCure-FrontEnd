export interface loginCredentials {
    email: string,
    password: string
}

export interface signUpCredential {
    username: string;
    email: string;
    password: string;
    dateOfbirth: Date;
}

export interface WalletHistory {
    amount: number;
    date: Date;
    description: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    dateOfbirth: string;
    medCertificate: string;
    profilePhoto: string;
    isBlocked: boolean;
    statusUpdating: boolean;
    walletMoney: number;
    walletHistory: WalletHistory[];
}

export interface LoginResponse {
    message: string;
    token: string;
}

export interface SignUpResponse {
    message: string;

}

export interface otpResponse {
    message: string;
}

export interface ResendResponse {
    message: string;
}

export interface GetUserResponse {
    message: string;
    users: User[];
}

export interface adminLoginResponse {
    message: string;
    token: string;
}

export interface docSignUpCredential {
    doctorname: string,
    email: string,
    password: string,
    age: number,
    speacialty: string,
    description: string
}

export interface Doctor {
    _id: string;
    doctorname: string,
    email: string,
    password: string,
    dateOfbirth: string,
    specialty: string,
    description: string,
    workExperience: string,
    profilePhoto: string,
    certificates: string[]
    isBlocked: boolean;
    statusUpdating: boolean;
    isVerified: boolean, default: false;
}

export interface Specialty {
    _id: string;
    specialtyImage: File | null,
    specialtyName: string;
    isDocAvailable: boolean; //admin change the status ,then it will updated
    amount: number | null
    doctors: []
}

export interface ConsultationSlot {
    _id: string;
    doctorId: string;
    date: string;
    startTime: string;
    isAvailable: boolean;
    isBooked: boolean;
    consultationMethod: string
    isDefault:boolean;
    statusUpdating: boolean;
    specialtyId: string;
    message?: string;
}

export interface ChatMessage {
    _id: string;
    senderId: string;
    receiverId: string;
    message?: string;
    timestamp: Date;
    audioBuffer?: ArrayBuffer;
    audioUrl?: string;
}

export interface Bookings {
    _id: string;
    paymentId: string;
    amount: number;
    userId: {
        medCertificate: any;
        _id: string;
        username: string;
    };
    slotId: string;
    specialtyId: {
        _id: string;
        specialtyName: string
    };
    doctorId: {
        _id: string;
        doctorname: string
    },
    payBookDate: Date;
    startTime: string;
    consultationStatus: boolean;
    consultationMethod: string;
    bookingStatus: boolean;
    cancelledBy?: string;
}

export interface Subscription {
    _id: string;
    plan: string;
    price: number;
    features: string[];
    active: boolean;
    startDate: Date;
    endDate?: Date;
    userId: string;
}

export interface Prescription {
    _id: string;
    doctorId: {
        _id: string,
        doctorname: string,
        profilePhoto: string
    };
    patientId: {
        _id: string,
        username: string,
        profilePhoto: string
    };
    prescriptionData: {
        patientInfo: {
            name: string;
            age: number;
            gender: string;
        };
        doctorInfo: {
            name: string;
            contact: string;
            specialization: string;
        };
        medications: {
            name: string;
            dosage: string;
            frequency: string;
        }[];
        additionalNotes: string;
    };
    createdAt: Date;
}

export interface Feedback {
    comment: string;
    rating: number;
    userId: {
        _id: string,
        username: string,
        profilePhoto: string
    }
    doctorId: string;
    date?: Date;
    _id: string
}

export interface Reports {
    reporterId: string;
    reportedUserId: string;
    reporterRole: 'patient' | 'doctor';
    reportedUserRole: 'patient' | 'doctor';
    reason: string;
    comments: string;
    status: boolean;
    createdAt: Date;
    reporterName?: string; 
    reporterEmail?: string;
    reportedUserName?: string;
    reportedUserEmail?: string;
    _id?: string
}



