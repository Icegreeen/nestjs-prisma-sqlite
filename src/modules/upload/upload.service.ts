import { BadRequestException, Injectable } from '@nestjs/common';
import { FileDTO } from './upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {

    async upload(file: FileDTO) {
        const supabaseURL = "https://yvbaekfrgxwqwswwknzk.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YmFla2ZyZ3h3cXdzd3drbnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjY2MDM2NywiZXhwIjoyMDIyMjM2MzY3fQ.MVeTTj6V_3UzKVDaE_s0ANkVftmOuMsIvPI7dgV3cuc"
        
        try {
            if(!isFileTypeAllowed(file.originalname)) {
                throw new BadRequestException('File type not allowed.')
            }

            const supabase = createClient(supabaseURL, supabaseKey, {
                auth: {
                    persistSession: false
                }
            });
    
            const data = await supabase.storage.from("my_storage").upload(file.originalname, file.buffer, {
                upsert: true
            })
    
            return data;
        } catch (error) {
            if(error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            
            throw new Error('Failed to upload file to Supabase');
        }
    }
}

function isFileTypeAllowed(filename: string): boolean {

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = filename.split('.').pop().toLowerCase();

    return !!fileExtension && allowedExtensions.includes(fileExtension);
}
