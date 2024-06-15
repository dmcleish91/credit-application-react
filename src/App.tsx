import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React from 'react';
import { toast } from 'sonner';
import axios, { AxiosResponse } from 'axios';

function App() {
  const [firstname, setFirstname] = React.useState<string>('');
  const [lastname, setLastname] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [employer, setEmployer] = React.useState<string>('');
  const [annualIncome, setAnnualIncome] = React.useState<string>('');
  const [requestedCreditAmount, setRequestedCreditAmount] = React.useState<string>('');
  const [additionalInformation, setAdditionalInformation] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined);

  function handleFirstname(value: string) {
    setFirstname(value);
  }

  function handleLastname(value: string) {
    setLastname(value);
  }

  function handleAddress(value: string) {
    setAddress(value);
  }

  function handlePhoneNumber(value: string) {
    // Remove all non-digit characters so we can only parse the numbers
    const numericValue = value.replace(/\D/g, '');

    let formattedNumber = '';

    if (numericValue.length > 0) {
      // If the length is 3 or less, just add the digits
      if (numericValue.length <= 3) {
        formattedNumber = numericValue;
      }
      // If the length is between 4 and 7, format as XXX-XXX
      else if (numericValue.length <= 6) {
        formattedNumber = `${numericValue.substring(0, 3)}-${numericValue.substring(3)}`;
      }
      // If the length is greater than 7, format as XXX-XXX-XXXX
      else {
        formattedNumber = `${numericValue.substring(0, 3)}-${numericValue.substring(3, 6)}-${numericValue.substring(
          6,
          10
        )}`;
      }
    }

    setPhoneNumber(formattedNumber);
  }

  function handleEmail(value: string) {
    setEmail(value);
  }

  function handleEmployer(value: string) {
    setEmployer(value);
  }

  function handleAnnualIncome(value: string) {
    setAnnualIncome(value);
  }

  function handleRequestedCreditAmount(value: string) {
    setRequestedCreditAmount(value);
  }

  function handleadditionalInformation(value: string) {
    setAdditionalInformation(value);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleSubmit() {
    const payload = {
      uuid: crypto.randomUUID(),
      firstname,
      lastname,
      address,
      phoneNumber,
      email,
      employer,
      annualIncome: Number(annualIncome),
      requestedCreditAmount: Number(requestedCreditAmount),
      additionalInformation,
    };

    console.log(payload);

    const postRequest = (url: string, data: typeof payload, file?: File): Promise<AxiosResponse[]> => {
      const postJsonData = axios.post(url + '/newcredit', data, {
        headers: {
          Authorization: 'Basic YWRtaW46c2VjcmV0',
        },
      });

      const postFileData = (): Promise<AxiosResponse> => {
        if (file) {
          const fileData = new FormData();
          fileData.append('uuid', payload.uuid);
          fileData.append('file', file);

          return axios.post(url + '/uploadPDF', fileData, {
            headers: {
              Authorization: 'Basic YWRtaW46c2VjcmV0',
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          return Promise.resolve({} as AxiosResponse);
        }
      };

      return new Promise((resolve, reject) => {
        postJsonData
          .then((jsonResponse) => {
            if (file) {
              postFileData()
                .then((fileResponse) => {
                  resolve([jsonResponse, fileResponse]);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve([jsonResponse]);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    toast.promise(postRequest(import.meta.env.VITE_API_URL, payload, selectedFile), {
      loading: 'Submitting Application...',
      success: () => {
        return `Thanks for your submission`;
      },
      error: 'Error',
    });
  }

  return (
    <div className='flex max-w-full h-screen justify-center items-center'>
      <Card className='w-full max-w-4xl'>
        <CardHeader>
          <CardTitle>Credit Application</CardTitle>
          <CardDescription>Please fill out the following information to apply for credit.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='first-name'>First Name</Label>
              <Input
                id='first-name'
                placeholder='John'
                value={firstname}
                onChange={(e) => handleFirstname(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='last-name'>Last Name</Label>
              <Input
                id='last-name'
                placeholder='Doe'
                value={lastname}
                onChange={(e) => handleLastname(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <Input
                id='address'
                placeholder='123 Main St, Anytown USA'
                value={address}
                onChange={(e) => handleAddress(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone Number</Label>
              <Input
                id='phone'
                type='tel'
                placeholder='(123) 456-7890'
                value={phoneNumber}
                onChange={(e) => handlePhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                value={email}
                onChange={(e) => handleEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='employer'>Employer</Label>
              <Input
                id='employer'
                placeholder='Acme Inc.'
                value={employer}
                onChange={(e) => handleEmployer(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='income'>Annual Income</Label>
              <Input
                id='income'
                type='number'
                placeholder='$50,000'
                value={annualIncome}
                onChange={(e) => handleAnnualIncome(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='credit-amount'>Requested Credit Amount</Label>
              <Input
                id='credit-amount'
                type='number'
                placeholder='$5,000'
                value={requestedCreditAmount}
                onChange={(e) => handleRequestedCreditAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='comments'>Additional Information</Label>
            <Textarea
              id='comments'
              placeholder='Please provide any additional information or comments.'
              value={additionalInformation}
              onChange={(e) => handleadditionalInformation(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label>Supporting Documents</Label>
            <div className='flex items-center space-x-2'>
              <Input type='file' id='document1' onChange={(e) => handleFileChange(e)} />
              <Label htmlFor='document1' className='cursor-pointer'>
                <UploadIcon className='w-5 h-5' />
                <span className='sr-only'>Upload document</span>
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' className='ml-auto' onClick={() => handleSubmit()}>
            Submit Application
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default App;

interface UploadIconProps extends React.SVGProps<SVGSVGElement> {}

const UploadIcon: React.FC<UploadIconProps> = (props) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='17 8 12 3 7 8' />
      <line x1='12' x2='12' y1='3' y2='15' />
    </svg>
  );
};
