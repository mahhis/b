export default class typeFullCardInfo{

        success!: boolean
        code!: number
        BIN!: {
            "valid": boolean,
            "number": number,
            "length": number,
            "scheme": string,
            "brand": string,
            "type": string,
            "level": string,
            "currency": string,
            "issuer": {
                "name": string,
                "website": string,
                "phone": string
            },
            "country": {
                "name":string,
                "native": string,
                "flag": string,
                "numeric": string,
                "capital": string,
                "currency": string,
                "currency_symbol": string,
                "region": string,
                "subregion": string,
                "idd": string,
                "alpha2": string,
                "alpha3": string,
                "language": string,
                "language_code":string,
                "latitude": number,
                "longitude": number
            }
        }
    }

