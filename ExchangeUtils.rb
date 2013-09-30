require 'csv'
require 'uri'
require 'net/http'

class Time
  def is_weekend?
    [0, 6, 7].include?(wday)
  end
end

module HuiLv

  def self.getUnionpay(dateStr)
    postData = Net::HTTP.post_form(URI.parse('http://en.unionpay.com/front.do'), 
                               {
    "go" => "cup_exrate_pg_ExchangeRateSearch",
    "frontFlag" => "Y",
    "exchangeRate.rateTime" => dateStr,
    "exchangeRate.tranCurrnecyId" => "58551763",
    "exchangeRate.baseCurrencyId" => "58678246"
  })

    result = postData.body.match(/KRW= .*&nbsp/)
    return nil if result == nil
    huilv =  result.to_s.match(/\d\.\d*/).to_s.to_f
    return (1/huilv)
  end

  def self.getLastestUnionPayHuilvAndDate(timeStr=getLstestUnionPayDate)
    rateHash = getRateFromCSV
    rate = rateHash[timeStr]
    if rate.nil?
      rate = getUnionpay(timeStr)
      if rate.nil? #today rate not exist 
        timeStr = simpleT(Time.parse(timeStr) - 86400)
        rate = getLastestUnionPayHuilvAndDate(timeStr)[:rate] 
      end
      saveRateToCSV(rateHash.update(timeStr => rate))
    end
    return {:timeStr => timeStr, :rate => rate}
  end

  def self.getLstestUnionPayDate(time=Time.now.utc)
    return simpleT(time) if !time.is_weekend?
    getLstestUnionPayDate(time - 86400)
  end

  def self.saveRateToCSV(hash)
    CSV.open("data.csv", "wb") {|csv| hash.to_a.each {|elem| csv << elem} }
  end

  def self.getRateFromCSV()
    hash = {}
    CSV.read('data.csv').map {|a| hash.update(a[0] => a[1]) } if File.exist?('data.csv')
    hash
  end

  def self.simpleT(time)
    time.strftime('%F')
  end
end