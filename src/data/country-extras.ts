export type Tipping = 'none' | 'rounding' | 'service_included' | 'optional' | 'ten_percent';
export type TapWater = 'safe' | 'caution' | 'unsafe';
export type Payment = 'card' | 'cash' | 'mixed';

export interface CountryExtra {
  tipping: Tipping;
  tapWater: TapWater;
  payment: Payment;
  emergency: { general: string; police?: string; ambulance?: string; fire?: string };
  transportNote?: string; // 대표 교통패스/카드
}

export const EXTRAS: Record<string, CountryExtra> = {
  JP: { tipping:'none', tapWater:'safe', payment:'card', emergency:{ general:'119', police:'110' }, transportNote:'Suica/ICOCA/PASMO' },
  FR: { tipping:'service_included', tapWater:'safe', payment:'card', emergency:{ general:'112' }, transportNote:'Navigo' },
  GB: { tipping:'optional', tapWater:'safe', payment:'card', emergency:{ general:'999' }, transportNote:'Oyster/Contactless' },
  US: { tipping:'ten_percent', tapWater:'caution', payment:'card', emergency:{ general:'911' }, transportNote:'도시별 상이(메트로카드 등)' },
  TH: { tipping:'optional', tapWater:'unsafe', payment:'cash', emergency:{ general:'191' }, transportNote:'Rabbit(BTS 방콕)' },
  DE: { tipping:'rounding', tapWater:'safe', payment:'card', emergency:{ general:'112' }, transportNote:'Deutschlandticket/지역권' },
  IT: { tipping:'optional', tapWater:'safe', payment:'mixed', emergency:{ general:'112' }, transportNote:'ATAC/ATM 지역권' },
  ES: { tipping:'rounding', tapWater:'safe', payment:'card', emergency:{ general:'112' }, transportNote:'T-Casual 등' },
  AU: { tipping:'none', tapWater:'safe', payment:'card', emergency:{ general:'000' }, transportNote:'Opal(Myki/Go Card 등 지역별)' },
  NZ: { tipping:'none', tapWater:'safe', payment:'card', emergency:{ general:'111' }, transportNote:'AT HOP 등' },
  SG: { tipping:'service_included', tapWater:'safe', payment:'card', emergency:{ general:'999' }, transportNote:'EZ-Link/NETS' },
  MY: { tipping:'optional', tapWater:'caution', payment:'mixed', emergency:{ general:'999' }, transportNote:'Touch ’n Go' },
  VN: { tipping:'optional', tapWater:'unsafe', payment:'cash', emergency:{ general:'113' } },
  ID: { tipping:'optional', tapWater:'unsafe', payment:'cash', emergency:{ general:'112' } },
  TW: { tipping:'none', tapWater:'safe', payment:'card', emergency:{ general:'110', ambulance:'119' }, transportNote:'EasyCard/iPASS' },
  HK: { tipping:'optional', tapWater:'safe', payment:'card', emergency:{ general:'999' }, transportNote:'Octopus' },
  CN: { tipping:'none', tapWater:'caution', payment:'mixed', emergency:{ general:'110', ambulance:'120', fire:'119' } },
  CA: { tipping:'ten_percent', tapWater:'safe', payment:'card', emergency:{ general:'911' } },
  AE: { tipping:'optional', tapWater:'safe', payment:'card', emergency:{ general:'999' }, transportNote:'Nol Card(두바이)' },
  TR: { tipping:'optional', tapWater:'caution', payment:'cash', emergency:{ general:'112' }, transportNote:'Istanbulkart' },
};
