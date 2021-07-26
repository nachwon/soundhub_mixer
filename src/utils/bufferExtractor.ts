import axios from "axios";

export class BufferExtractor {
  async extract(src: File | string): Promise<ArrayBuffer | undefined> {
    if (typeof (src) === 'string') {
      return await this.fromUrl(src)
    } else if (src instanceof File) {
      return await this.fromFile(src)
    } else {
      return undefined
    }
  }

  async fromFile(file: File) {
    return await file.arrayBuffer();
  }

  async fromUrl(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
}
