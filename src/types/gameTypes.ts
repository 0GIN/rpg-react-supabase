export interface Postac {
  id: number
  nick: string
  kredyty: number
  street_cred: number
  user_id: string
  created_at?: string
}

export interface ZlecenieDefinicja {
  id: number
  nazwa: string
  opis: string
  czas_trwania_sekundy: number
  nagrody: any
  created_at?: string
}

export interface AktywneZlecenie {
  id: number
  postac_id: number
  zlecenie_id: number
  koniec_zlecenia_o: string
  created_at?: string
}
