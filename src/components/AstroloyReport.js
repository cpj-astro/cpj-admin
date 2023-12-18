import React, { useEffect, useState } from 'react';
import MatchKundli from './MatchKundli';

const AstroloyReport = ({ astrologyData , matchData , userData }) => {
    const [reportData, setReportData] = useState({
        MatchName:'',
        MatchStart:'',
        Weather:'',
        ProfileName: '',
        SignName: '',
        LuckyColors: '',
        LuckyNumbers: '',
        MatchBet: '',
        FancyOrSession: '',
        FavTeam: '',
        YourMatchAstrology: '',
        FancyMatchData: '',
        AstrologicalBettingTime: '',
        AstroFavPlayers: '',
        OverallBettingForMatch: '',
        Suggestions: '',
        Direction: '',
        Mantras: '',
        SpecialRecommendation: '',
    });

    useEffect(() => {
      try {
        console.log("ss", userData);
          const data = astrologyData.astrology_data.split('#').map((item) => item.trim());
          
          setReportData({
              MatchName: matchData.team_a + ' Vs ' + matchData.team_b,
              MatchStart: matchData.match_date,
              Weather: matchData.weather,
              ProfileName: userData.first_name + ' ' + userData.last_name,
              SignName: userData.sign_name,
              LuckyColors: data[0],
              LuckyNumbers: data[1],
              MatchBet: data[2],
              FancyOrSession: data[3],
              FavTeam: data[4],
              YourMatchAstrology: data[5],
              FancyMatchData: data[6],
              AstrologicalBettingTime: data[7],
              AstroFavPlayers: data[8],
              OverallBettingForMatch: data[9],
              Suggestions: data[10],
              Direction: data[11],
              Mantras: data[12],
              SpecialRecommendation: data[13],
          });
      } catch (error) {
          console.log(error)
      }
    }, [astrologyData])
    return (
        <div id="main" className="main-container">
            <div className="container pt-20">
                <div className="row">
                    <div className="col-md-12">
                        <div className='row'>
                            <div className='col-md-8'>        
                                <div className="row">
                                    <div className='col-md-6'>
                                        <ul>
                                            <li>
                                                <span className='text-15'>Match Name</span>
                                                <p className='report-values'>{reportData.MatchName ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Match Start</span>
                                                <p className='report-values'>{reportData.MatchStart ?? 'N/A'} IST</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Weather</span>
                                                <p className='report-values'>{reportData.Weather ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Profile Name</span>
                                                <p className='report-values'>{reportData.ProfileName ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Your Rashi</span>
                                                <p className='report-values'>{reportData.SignName ?? 'N/A'}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='col-md-6'>
                                        <ul>
                                            <li>
                                                <span className='text-15'>Lucky Colors</span>
                                                <p className='report-values'>{reportData.LuckyColors ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Lucky Numbers</span>
                                                <p className='report-values'>{reportData.LuckyNumbers ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Match Bet</span>
                                                <p className='report-values'>{reportData.MatchBet ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Fancy/Session</span>
                                                <p className='report-values'>{reportData.FancyOrSession ?? 'N/A'}</p>
                                            </li>
                                            <li>
                                                <span className='text-15'>Favourite Team</span>
                                                <p className='report-values'>{reportData.FavTeam ?? 'N/A'}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='display-set mt-5'>
                                    <MatchKundli housesData={userData && userData.kundli_data ? userData.kundli_data : []} />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Match Astrology</span>
                            </div>
                            <span className='report-values'>
                                {reportData.YourMatchAstrology ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Fancy Match Data</span>
                            </div>
                            <span className='report-values'>
                                {reportData.FancyMatchData ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Astrological Betting Time</span>
                            </div>
                            <span className='report-values'>
                                {reportData.AstrologicalBettingTime ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Astrological Favourite Players</span>
                            </div>
                            <span className='report-values'>
                                {reportData.AstroFavPlayers ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Overall Betting For Match</span>
                            </div>
                            <span className='report-values'>
                                {reportData.OverallBettingForMatch ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Suggestions</span>
                            </div>
                            <span className='report-values'>
                                {reportData.Suggestions ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Direction</span>
                            </div>
                            <span className='report-values'>
                                {reportData.Direction ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Mantras</span>
                            </div>
                            <span className='report-values'>
                                {reportData.Mantras ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Special Recommendations</span>
                            </div>
                            <span className='report-values'>
                                {reportData.SpecialRecommendation ?? 'N/A'}
                            </span>
                        </div>
                        <hr />
                        <div className='container'>
                            <div className="country-info align-items-center">
                                <span className="country-name text-17 mb-10">Disclaimer</span>
                            </div>
                            <span className='report-values'>
                                <p>
                                    Strictly for Entertainment Purposes
                                </p>
                                <p>
                                    The “cricketpanditji.com“ provided herein is for entertainment purposes only. Any information, guidance, or advice offered during any course of the service provided by  “Cricket Panditji “ is not intended to substitute professional, legal, financial, or medical advice. 
                                </p>
                                <p>
                                    The content presented is based on interpretation, subjective analysis, and personal insights, and should not be considered as a substitute for expert advice. Individuals are encouraged to use their discretion and judgement in applying any information received during this service to their personal lives or decisions.
                                </p>
                                <p>
                                    We do not guarantee the accuracy, reliability, or completeness of any information provided during this service. Participants are advised to seek appropriate professional advice or consultation for specific concerns or issues.
                                </p>
                                <p>
                                    By engaging in this service, you acknowledge that any decisions or actions taken as a result of the information provided are at your own risk and discretion. Any information/advice/service must be taken as a pure entertainment and “Cricket Panditji takes no responsibility whatsoever in any manner, caused by any give any service/information by “Cricket Panditji“
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstroloyReport;
