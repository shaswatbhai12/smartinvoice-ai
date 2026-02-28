
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from "../types";

const INVOICE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    invoiceNumber: { type: Type.STRING, description: "Invoice Serial No or Number" },
    date: { type: Type.STRING, description: "Invoice Date (YYYY-MM-DD)" },
    vendorName: { type: Type.STRING },
    vendorAddress: { type: Type.STRING },
    vendorEmail: { type: Type.STRING },
    vendorPhone: { type: Type.STRING },
    vendorGstin: { type: Type.STRING, description: "GSTIN of the vendor" },
    clientName: { type: Type.STRING, description: "Billed to company name" },
    clientAddress: { type: Type.STRING },
    clientGstin: { type: Type.STRING, description: "GSTIN of the client/receiver" },
    pan: { type: Type.STRING },
    bankName: { type: Type.STRING },
    bankAccount: { type: Type.STRING },
    bankIfsc: { type: Type.STRING },
    cgstRate: { type: Type.NUMBER },
    sgstRate: { type: Type.NUMBER },
    igstRate: { type: Type.NUMBER },
    notes: { type: Type.STRING },
    currency: { type: Type.STRING, description: "Currency (e.g. INR, USD)" },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          hsnCode: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER, description: "Rate" },
        },
        required: ["description", "quantity", "unitPrice"],
      },
    },
  },
  required: ["vendorName", "clientName", "items"],
};

export const extractInvoiceFromImage = async (base64Image: string, mimeType: string): Promise<Partial<InvoiceData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (mimeType === 'application/x-zip-compressed' || !mimeType) {
    throw new Error(`Unsupported file format. Please upload an image or PDF.`);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image.split(',')[1] || base64Image,
              },
            },
            {
              text: "Extract data from this Indian Tax Invoice. Pay close attention to GSTIN numbers, HSN codes, and bank details. Format dates as YYYY-MM-DD.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: INVOICE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini.");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("I couldn't process this specific invoice layout. Please check the image quality.");
  }
};
