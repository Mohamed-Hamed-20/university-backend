import QRCode from 'qrcode'

export const GenerateQrCode=async(data)=>{
    const url = await QRCode.toDataURL(JSON.stringify(data));
    return url;
}