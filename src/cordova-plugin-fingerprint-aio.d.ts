
type IError = {
  message: string
}

interface FingerPrint {  
  isAvailable: (
    isAvailableSuccess: (available: string) => void,
    isAvailableError: (error: IError) => void
  ) => void;
}