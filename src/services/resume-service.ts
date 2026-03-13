import { apiClient } from './api-client';
import { 
    Resume, 
    ResumeVariant, 
    CreateResumeDto, 
    UpdateResumeDto, 
    CreateResumeVariantDto, 
    UpdateResumeVariantDto 
} from '@/types/resume';

class ResumeService {
    private readonly resumesResource = '/resumes';
    private readonly variantsResource = '/resume-variants';

    // --- Resumes ---
    async listResumes(): Promise<Resume[]> {
        const response = await apiClient.get<Resume[]>(this.resumesResource);
        return response.data;
    }

    async getResume(id: string): Promise<Resume> {
        const response = await apiClient.get<Resume>(`${this.resumesResource}/${id}`);
        return response.data;
    }

    async createResume(data: CreateResumeDto): Promise<Resume> {
        const response = await apiClient.post<Resume>(this.resumesResource, data);
        return response.data;
    }

    async updateResume(id: string, data: UpdateResumeDto): Promise<Resume> {
        const response = await apiClient.patch<Resume>(`${this.resumesResource}/${id}`, data);
        return response.data;
    }

    async setDefault(id: string): Promise<Resume> {
        const response = await apiClient.patch<Resume>(`${this.resumesResource}/${id}/default`);
        return response.data;
    }

    async deleteResume(id: string): Promise<void> {
        await apiClient.delete(`${this.resumesResource}/${id}`);
    }

    // --- Rendering ---
    getRenderUrls(id: string) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        return {
            pdf: `${baseUrl}${this.resumesResource}/${id}/pdf`,
            preview: `${baseUrl}${this.resumesResource}/${id}/preview`,
        };
    }

    async downloadPdf(id: string): Promise<Blob> {
        const response = await apiClient.get(`${this.resumesResource}/${id}/pdf`, {
            responseType: 'blob'
        });
        return new Blob([response.data], { type: 'application/pdf' });
    }

    async getPreviewBlob(id: string): Promise<Blob> {
        const response = await apiClient.get(`${this.resumesResource}/${id}/preview`, {
            responseType: 'blob'
        });
        return new Blob([response.data], { type: 'image/png' });
    }

    async renderPdfLive(data: Resume): Promise<Blob> {
        const response = await apiClient.post(`${this.resumesResource}/render-live/pdf`, data, {
            responseType: 'blob'
        });
        return new Blob([response.data], { type: 'application/pdf' });
    }

    async renderPreviewLive(data: Resume): Promise<any> {
        return await apiClient.post(`${this.resumesResource}/render-live/preview`, data, {
            responseType: 'blob'
        });
    }

    // --- Resume Variants ---
    async listVariants(): Promise<ResumeVariant[]> {
        const response = await apiClient.get<ResumeVariant[]>(this.variantsResource);
        return response.data;
    }

    async getVariant(id: string): Promise<ResumeVariant> {
        const response = await apiClient.get<ResumeVariant>(`${this.variantsResource}/${id}`);
        return response.data;
    }

    async createVariant(data: CreateResumeVariantDto): Promise<ResumeVariant> {
        const response = await apiClient.post<ResumeVariant>(this.variantsResource, data);
        return response.data;
    }

    async updateVariant(id: string, data: UpdateResumeVariantDto): Promise<ResumeVariant> {
        const response = await apiClient.patch<ResumeVariant>(`${this.variantsResource}/${id}`, data);
        return response.data;
    }

    async deleteVariant(id: string): Promise<void> {
        await apiClient.delete(`${this.variantsResource}/${id}`);
    }

    // --- Variant Rendering ---
    getVariantRenderUrls(id: string) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        return {
            pdf: `${baseUrl}${this.variantsResource}/${id}/pdf`,
            preview: `${baseUrl}${this.variantsResource}/${id}/preview`,
        };
    }

    async renderVariantPdf(id: string): Promise<Blob> {
        const response = await apiClient.post(`${this.variantsResource}/${id}/render`);
        return this.downloadVariantPdf(id);
    }

    async downloadVariantPdf(id: string): Promise<Blob> {
        const response = await apiClient.get(`${this.variantsResource}/${id}/pdf`, {
            responseType: 'blob'
        });
        return new Blob([response.data], { type: 'application/pdf' });
    }
}

export const resumeService = new ResumeService();
