import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import swal from 'sweetalert';
import { setDoc, getDoc, doc, collection, where, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from '../../auth-files/fbaseconfig';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
let flagPlus = false;
let matchDatas = null;
let onBatTeam = null;

export default function LiveMatchControl() {
    const {id} = useParams();
    const { register, handleSubmit, setValue, getValues, watch, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const [sessionValue, setSessionValue] = useState('');
    const [superOverSection, setShowSuperOverSection] = useState(false);
    const [oddTeamOneRadio, setOddTeamOneRadio] = useState(true);
    const [oddTeamTwoRadio, setOddTeamTwoRadio] = useState(false);
    const [oddComTeamOneRadio, setOddComTeamOneRadio] = useState(true);
    const [oddComTeamTwoRadio, setOddComTeamTwoRadio] = useState(false);
    const [oddTiedTeamOneRadio, setOddTiedTeamOneRadio] = useState(true);
    const [oddTiedTeamTwoRadio, setOddTiedTeamTwoRadio] = useState(false);
    const [suspendAll, setSuspendAll] = useState(false)
    const [fancyInfo, setFancyInfo] = useState([
        {
            over: false,
            suspend: false,
            s_over: 0,
            s_min: 0,
            s_max: 0,
            s_min_rate: 0,
            s_max_rate: 0
        },
        {
            over: false,
            suspend: false,
            s_over: 0,
            s_min: 0,
            s_max: 0,
            s_min_rate: 0,
            s_max_rate: 0
        }
    ]);    

    const onSubmitData = async (data) => {
        // if(getValues('bowler_runs') && getValues('bowler_overs')){
        //     var x = Number(getValues('bowler_overs'));
        //     var int_part = Math.trunc(x); 
        //     var float_part = Number((x-int_part).toFixed(2))
        //     const totalRuns = Number(getValues('bowler_runs'))
        //     const totalOver = int_part;
        //     const totalSplitOver = Number((float_part + "").split(".")[1]);
        //     const economy = totalSplitOver > 0 ? (totalRuns / (totalOver + (totalSplitOver/6))) : (totalRuns/totalOver);
        //     setValue('bowlers_economy', Number(economy.toFixed(2)))
        // }

        const docRef = doc(db, "matchdata", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            let dataValue = {
                first_circle: getValues('first_circle') ? getValues('first_circle') : '',
                session: sessionValue ? sessionValue : '',
                // on_strike: getValues('on_strike') ? getValues('on_strike') : '',
                batsman:[
                    {
                        ball: getValues('batsman_1_balls') ? Number(getValues('batsman_1_balls')) : 0,
                        fours: getValues('batsman_1_4s') ? Number(getValues('batsman_1_4s')) : 0,
                        name: getValues('batsman_1') ? getValues('batsman_1') : '',
                        run: getValues('batsman_1_runs') ? Number(getValues('batsman_1_runs')) : 0,
                        sixes: getValues('batsman_1_6s') ? Number(getValues('batsman_1_6s')) : 0,
                        strike_rate: getValues('batsman_1_strike_rate') ? Number(getValues('batsman_1_strike_rate')) : 0
                    },
                    {
                        ball: getValues('batsman_2_balls') ? Number(getValues('batsman_2_balls')) : 0,
                        fours: getValues('batsman_2_4s') ? Number(getValues('batsman_2_4s')) : 0,
                        name: getValues('batsman_2') ? getValues('batsman_2') : '',
                        run: getValues('batsman_2_runs') ? Number(getValues('batsman_2_runs')) : 0,
                        sixes: getValues('batsman_2_6s') ? Number(getValues('batsman_2_6s')) : 0,
                        strike_rate: getValues('batsman_2_strike_rate') ? Number(getValues('batsman_2_strike_rate')) : 0
                    }
                ],
                bolwer:{
                    economy: getValues('bowlers_economy') ? Number(getValues('bowlers_economy')) : 0,
                    name: getValues('bowler') ? getValues('bowler') : '',
                    over: getValues('bowler_overs') ? getValues('bowler_overs') : 0,
                    run: getValues('bowler_runs') ? Number(getValues('bowler_runs')) : 0,
                    wicket: getValues('bowler_wicket') ? Number(getValues('bowler_wicket')) : 0
                },      
                batting_team: getValues('batting_team') ? getValues('batting_team') : '',
                target: getValues('target') ? getValues('target') : 0,
                match_rain_status: getValues('match_rain_status') ? true : false,
                fav_team: getValues('fav_team') ? getValues('fav_team') : '',
                
                back1_raw: getValues('match_odd_team_1_text_1') ? getValues('match_odd_team_1_text_1') : '',
                back2_raw: getValues('match_odd_team_2_text_1') ? getValues('match_odd_team_2_text_1') : '',
                lay1_raw: getValues('match_odd_team_1_text_2') ? getValues('match_odd_team_1_text_2') : '',
                lay2_raw: getValues('match_odd_team_2_text_2') ? getValues('match_odd_team_2_text_2') : '',

                mc_back1_raw: getValues('match_com_odd_team_1_text_1') ? getValues('match_com_odd_team_1_text_1') : 0,
                mc_lay1_raw: getValues('match_com_odd_team_1_text_2') ? getValues('match_com_odd_team_1_text_2') : 0,
                mc_back2_raw: getValues('match_com_odd_team_2_text_1') ? getValues('match_com_odd_team_2_text_1') : 0,
                mc_lay2_raw: getValues('match_com_odd_team_2_text_2') ? getValues('match_com_odd_team_2_text_2') : 0,

                mt_back1_raw: getValues('match_tied_odd_team_1_text_1') ? getValues('match_tied_odd_team_1_text_1') : 0,
                mt_lay1_raw: getValues('match_tied_odd_team_1_text_2') ? getValues('match_tied_odd_team_1_text_2') : 0,
                mt_back2_raw: getValues('match_tied_odd_team_2_text_1') ? getValues('match_tied_odd_team_2_text_1') : 0,
                mt_lay2_raw: getValues('match_tied_odd_team_2_text_2') ? getValues('match_tied_odd_team_2_text_2') : 0,

                back1: getValues('back1') ? getValues('back1') : '',
                back2: getValues('back2') ? getValues('back2') : '',
                lay1: getValues('lay1') ? getValues('lay1') : '',
                lay2: getValues('lay2') ? getValues('lay2') : '',

                match_completed: {
                    status: getValues('match_completed_status') ? true : false,
                    t1: 'YES',
                    t2: 'NO',
                    t1_back: getValues('mc_odd_back1') ? Number(getValues('mc_odd_back1')) : 0,
                    t1_lay: getValues('mc_odd_lay1') ? Number(getValues('mc_odd_lay1')) : 0,
                    t2_back: getValues('mc_odd_back2') ? Number(getValues('mc_odd_back2')) : 0,
                    t2_lay: getValues('mc_odd_lay2') ? Number(getValues('mc_odd_lay2')) : 0,
                },
                match_tied: {
                    status: getValues('match_tied_status') ? true : false,
                    t1: 'YES',
                    t2: 'NO',
                    t1_back: getValues('mt_odd_back1') ? Number(getValues('mt_odd_back1')) : 0,
                    t1_lay: getValues('mt_odd_lay1') ? Number(getValues('mt_odd_lay1')) : 0,
                    t2_back: getValues('mt_odd_back2') ? Number(getValues('mt_odd_back2')) : 0,
                    t2_lay: getValues('mt_odd_lay2') ? Number(getValues('mt_odd_lay2')) : 0,
                },
                fancy_info: fancyInfo,
                suspend_all: suspendAll,
                fancy_api: getValues('fancy_api') ? true : false,
                commentary_api: getValues('commentary_api') ? true : false,
                match_odds_api: getValues('match_odds_api') ? true : false,
                session_api: getValues('session_api') ? true : false,
                weather: getValues('weather') ? getValues('weather') : '',
                scroller: getValues('scroller') ? getValues('scroller') : '',
                tips: getValues('tips') ? getValues('tips') : '',
            }
            
            // if(onBatTeam == getValues('team_a_id')) {
            //     dataValue = {...dataValue ,                 
            //         team_a: getValues('team_a') ? getValues('team_a') : '',
            //         team_a_id: getValues('team_a_id') ? Number(getValues('team_a_id')) : '',
            //         team_a_img: getValues('team_a_img') ? getValues('team_a_img') : '',
            //         team_a_over: (onBatTeam == getValues('team_a_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //         team_a_score: {
            //             1: {
            //                 ball: (onBatTeam == getValues('team_a_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //                 score: (onBatTeam == getValues('team_a_id')) && getValues('team_runs') ? Number(getValues('team_runs')) : '',
            //                 wicket: (onBatTeam == getValues('team_a_id')) && getValues('team_wickets') ? Number(getValues('team_wickets')) : '',
            //             },
            //             team_id: getValues('team_b_id') ? getValues('team_b_id') : '',
            //         },
            //         team_a_scores: (onBatTeam == getValues('team_a_id')) && getValues('team_runs') && getValues('team_wickets') ? getValues('team_runs') + "-" + getValues('team_wickets')  : '',
            //         team_a_scores_over: [
            //             {
            //                 over: (onBatTeam == getValues('team_a_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //                 score: (onBatTeam == getValues('team_a_id')) && getValues('team_runs') && getValues('team_wickets') ? getValues('team_runs') + "-" + getValues('team_wickets')  : '',
            //             }  
            //         ],
            //         team_a_short: (onBatTeam == getValues('team_a_id')) && getValues('team_a_short') ? getValues('team_a_short') : '',
            //     }
            // } else if (onBatTeam == getValues('team_b_id')) {
            //     dataValue = {...dataValue , 
            //         team_b: getValues('team_b') ? getValues('team_b') : '',
            //         team_b_id: getValues('team_b_id') ? Number(getValues('team_b_id')) : '',
            //         team_b_img: getValues('team_b_img') ? getValues('team_b_img') : '',
            //         team_b_over: (onBatTeam == getValues('team_b_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //         team_b_score: {
            //             2: {
            //                 ball: (onBatTeam == getValues('team_b_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //                 score: (onBatTeam == getValues('team_b_id')) && (onBatTeam == getValues('team_b_id')) && getValues('team_runs') ? Number(getValues('team_runs')) : '',
            //                 wicket: getValues('team_wickets') ? Number(getValues('team_wickets')) : '',
            //             },
            //             team_id: getValues('team_b_id') ? getValues('team_b_id') : '',
            //         },
            //         team_b_scores: (onBatTeam == getValues('team_b_id')) && getValues('team_runs') && getValues('team_wickets') ? getValues('team_runs') + "-" + getValues('team_wickets')  : '',
            //         team_b_scores_over: [
            //             {
            //                 over: (onBatTeam == getValues('team_b_id')) && getValues('team_curr_ovr') ? getValues('team_curr_ovr') : '',
            //                 score: (onBatTeam == getValues('team_b_id')) && getValues('team_runs') && getValues('team_wickets') ? getValues('team_runs') + "-" + getValues('team_wickets')  : '',
            //             }  
            //         ],
            //         team_b_short: (onBatTeam == getValues('team_b_id')) && getValues('team_b_short') ? getValues('team_b_short') : '',
            //     }
            // }
            await setDoc(doc(db, "matchdata", id), dataValue, {merge: true})
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                console.error('Error writing document:', error);
            });   
        }
    }

    useEffect(() => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        const params = {
            match_id: id,
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/matchInfo` : `${process.env.REACT_APP_LOCAL_API_URL}/matchInfo`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                let matchInfo = response.data.data;
                setValue('pitch_report', matchInfo.pitch_report);
                setValue('weather', matchInfo.weather);
            }
        }).catch((error) => {
            console.log("matchInfoError", error)
        });
    }, []);
    
    useEffect(() => {
        onSnapshot(doc(db, "matchdata", id), (doc) => {
            matchDatas = doc.data();    
            if(!isObjectEmpty(matchDatas)){
                onBatTeam = matchDatas.batting_team
                setValue('batting_team', onBatTeam)
                // let totalOverBalls = Number(getValues('match_over')) * 6
                // if(onBatTeam == matchDatas.team_a_id) {
                //     let teamAScore = matchDatas.team_a_score;
                //     let teamAScoreOver = matchDatas.team_a_scores_over;
                //     setValue('team_runs', teamAScore[1].score);
                //     setValue('team_wickets', teamAScore[1].wicket);
                //     setValue('team_curr_ovr', teamAScoreOver[0].over);
                //     setValue('team_total_ovr', matchDatas.match_over);
                //     setValue('target', matchDatas.target);
                //     if(getValues('target') && getValues('team_runs')){
                //         setValue('team_run_need', Number(getValues('target')) - Number(getValues('team_runs')));
                //     }
                //     var z = Number(getValues('team_curr_ovr'));
                //     var int_z_part = Math.trunc(z); 
                //     var float_z_part = Number((z-int_z_part).toFixed(2))
                //     const totalZOver = int_z_part;
                //     const totalZSplitOver = Number((float_z_part + "").split(".")[1]);
                    
                //     if(float_z_part === 0){
                //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - (Number(totalZOver) * 6) : '')
                //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / Number(totalZOver))).toFixed(2) : '')
                //     } else {
                //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - ((Number(totalZOver) * 6) + totalZSplitOver) : '')
                //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / ((totalZSplitOver/6) + totalZOver))).toFixed(2) : '')
                //     }
                //     setValue('team_rr_rate', getValues('team_run_need') && getValues('team_rem_balls') ? (Number(getValues('team_run_need') / Number(getValues('team_rem_balls'))) * 6).toFixed(2) : '')
                // } else if(onBatTeam == matchDatas.team_b_id) {
                //     let teamBScore = matchDatas.team_b_score;
                //     let teamBScoreOver = matchDatas.team_b_scores_over;
                //     setValue('team_runs', teamBScore[2].score);
                //     setValue('team_wickets', teamBScore[2].wicket);
                //     setValue('team_curr_ovr', teamBScoreOver[0].over);
                //     setValue('team_total_ovr', matchDatas.match_over);
                //     setValue('target', matchDatas.target);
                //     if(getValues('target') && getValues('team_runs')){
                //         setValue('team_run_need', Number(getValues('target')) - Number(getValues('team_runs')));
                //     }
                //     var z = Number(getValues('team_curr_ovr'));
                //     var int_z_part = Math.trunc(z); 
                //     var float_z_part = Number((z-int_z_part).toFixed(2))
                //     const totalZOver = int_z_part;
                //     const totalZSplitOver = Number((float_z_part + "").split(".")[1]);
                //     if(float_z_part === 0){
                //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - (Number(totalZOver) * 6) : '')
                //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / Number(totalZOver))).toFixed(2) : '')
                //     } else {
                //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - ((Number(totalZOver) * 6) + totalZSplitOver) : '')
                //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / ((totalZSplitOver/6) + totalZOver))).toFixed(2) : '')
                //     }
                //     setValue('team_rr_rate',  getValues('team_run_need') && getValues('team_rem_balls') ? (Number(getValues('team_run_need') / Number(getValues('team_rem_balls'))) * 6).toFixed(2) : '')
                // }
                setValue('first_circle', matchDatas && matchDatas.first_circle ? matchDatas.first_circle : '')
                setValue('batsman_1', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[0].name : '')
                setSessionValue(matchDatas.session);
                setValue('batsman_1_balls', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[0].ball : 0)
                setValue('batsman_1_runs', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[0].run : 0)
                setValue('batsman_1_strike_rate', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[0].strike_rate : 0)
                setValue('batsman_1_4s', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[0].fours : 0)
                setValue('batsman_1_6s',matchDatas && matchDatas.batsman.length > 0 ?  matchDatas.batsman[0].sixes : 0)
                setValue('batsman_2', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].name : 0)
                setValue('batsman_2_balls', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].ball : 0)
                setValue('batsman_2_runs', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].run : 0)
                setValue('batsman_2_strike_rate', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].strike_rate : 0)
                setValue('batsman_2_4s', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].fours : 0)
                setValue('batsman_2_6s', matchDatas && matchDatas.batsman.length > 0 ? matchDatas.batsman[1].sixes : 0)
                setValue('bowler', matchDatas && matchDatas.bolwer && matchDatas.bolwer.name ? matchDatas.bolwer.name : '')
                setValue('bowler_wicket', matchDatas && matchDatas.bolwer && matchDatas.bolwer.wicket ? matchDatas.bolwer.wicket : 0)
                setValue('bowler_runs', matchDatas && matchDatas.bolwer && matchDatas.bolwer.run ? matchDatas.bolwer.run : 0)
                setValue('bowler_overs', matchDatas && matchDatas.bolwer && matchDatas.bolwer.over ? matchDatas.bolwer.over : 0)
                setValue('bowlers_economy', matchDatas && matchDatas.bolwer && matchDatas.bolwer.economy ? matchDatas.bolwer.economy : 0)
                setValue('on_strike', matchDatas && matchDatas.on_strike ? matchDatas : '');

                // setValue('target', matchDatas && matchDatas.target ? matchDatas.target : 0);
                setValue('team_a', matchDatas && matchDatas.team_a ? matchDatas.team_a : '');
                setValue('team_a_id', matchDatas && matchDatas.team_a_id ? matchDatas.team_a_id : 0);
                // setValue('team_a_img', matchDatas && matchDatas.team_a_img ? matchDatas.team_a_img : '');
                // setValue('team_a_over', matchDatas && matchDatas.team_a_over ? matchDatas.team_a_over : 0);
                // setValue('team_a_score', matchDatas && matchDatas.team_a_score ? matchDatas.team_a_score : 0);
                // setValue('team_a_scores', matchDatas && matchDatas.team_a_scores ? matchDatas.team_a_scores : 0);
                // setValue('team_a_scores_over', matchDatas && matchDatas.team_a_scores_over ? matchDatas.team_a_scores_over : 0);
                setValue('team_a_short', matchDatas && matchDatas.team_a_short ? matchDatas.team_a_short : '');
                setValue('team_b', matchDatas && matchDatas.team_b ? matchDatas.team_b : '');
                setValue('team_b_id', matchDatas && matchDatas.team_b_id ? matchDatas.team_b_id : 0);
                // setValue('team_b_img', matchDatas && matchDatas.team_b_img ? matchDatas.team_b_img : '');
                // setValue('team_b_over', matchDatas && matchDatas.team_b_over ? matchDatas.team_b_over : 0);
                // setValue('team_b_score', matchDatas && matchDatas.team_b_score ? matchDatas.team_b_score : 0);
                // setValue('team_b_scores', matchDatas && matchDatas.team_b_scores ? matchDatas.team_b_scores : 0);
                // setValue('team_b_scores_over', matchDatas && matchDatas.team_b_scores_over ? matchDatas.team_b_scores_over : 0);
                setValue('team_b_short', matchDatas && matchDatas.team_b_short ? matchDatas.team_b_short : '');
                // setValue('match_over', matchDatas && matchDatas.match_over ? matchDatas.match_over : 0);
                
                setValue('match_odd_team_1_text_1', matchDatas && matchDatas.back1_raw ? matchDatas.back1_raw : '')
                setValue('match_odd_team_1_text_2', matchDatas && matchDatas.lay1_raw ? matchDatas.lay1_raw : '')
                setValue('match_odd_team_2_text_1', matchDatas && matchDatas.back2_raw ? matchDatas.back2_raw : '')
                setValue('match_odd_team_2_text_2', matchDatas && matchDatas.lay2_raw ? matchDatas.lay2_raw : '')
                setValue('back1', matchDatas && matchDatas.back1 ? matchDatas.back1 : '')
                setValue('lay1', matchDatas && matchDatas.lay1 ? matchDatas.lay1 : '')
                setValue('back2', matchDatas && matchDatas.back2 ? matchDatas.back2 : '')
                setValue('lay2', matchDatas && matchDatas.lay2 ? matchDatas.lay2 : '')

                setValue('match_com_odd_team_1_text_1', matchDatas && matchDatas.mc_back1_raw ? matchDatas.mc_back1_raw : '')
                setValue('match_com_odd_team_1_text_2', matchDatas && matchDatas.mc_lay1_raw ? matchDatas.mc_lay1_raw : '')
                setValue('match_com_odd_team_2_text_1', matchDatas && matchDatas.mc_back2_raw ? matchDatas.mc_back2_raw : '')
                setValue('match_com_odd_team_2_text_2', matchDatas && matchDatas.mc_lay2_raw ? matchDatas.mc_lay2_raw : '')
                setValue('mc_odd_back1', matchDatas && matchDatas.match_completed && matchDatas.match_completed.t1_back ? matchDatas.match_completed.t1_back : '')
                setValue('mc_odd_lay1', matchDatas && matchDatas.match_completed && matchDatas.match_completed.t1_lay ? matchDatas.match_completed.t1_lay : '')
                setValue('mc_odd_back2', matchDatas &&  matchDatas.match_completed && matchDatas.match_completed.t2_back ? matchDatas.match_completed.t2_back : '')
                setValue('mc_odd_lay2', matchDatas &&  matchDatas.match_completed && matchDatas.match_completed.t2_lay ? matchDatas.match_completed.t2_lay : '')

                setValue('match_tied_odd_team_1_text_1', matchDatas && matchDatas.mt_back1_raw ? matchDatas.mt_back1_raw : '')
                setValue('match_tied_odd_team_1_text_2', matchDatas && matchDatas.mt_lay1_raw ? matchDatas.mt_lay1_raw : '')
                setValue('match_tied_odd_team_2_text_1', matchDatas && matchDatas.mt_back2_raw ? matchDatas.mt_back2_raw : '')
                setValue('match_tied_odd_team_2_text_2', matchDatas && matchDatas.mt_lay2_raw ? matchDatas.mt_lay2_raw : '')
                setValue('mt_odd_back1', matchDatas && matchDatas.match_tied && matchDatas.match_tied.t1_back ? matchDatas.match_tied.t1_back : '')
                setValue('mt_odd_lay1', matchDatas && matchDatas.match_tied && matchDatas.match_tied.t1_lay ? matchDatas.match_tied.t1_lay : '')
                setValue('mt_odd_back2', matchDatas && matchDatas.match_tied && matchDatas.match_tied.t2_back ? matchDatas.match_tied.t2_back : '')
                setValue('mt_odd_lay2', matchDatas && matchDatas.match_tied && matchDatas.match_tied.t2_lay ? matchDatas.match_tied.t2_lay : '')

                setValue('commentary_api', matchDatas && matchDatas.commentary_api ? true : false)
                setValue('match_odds_api', matchDatas && matchDatas.match_odds_api ? true : false)
                setValue('session_api', matchDatas && matchDatas.session_api ? true : false)
                setValue('fancy_api', matchDatas && matchDatas.fancy_api ? true : false)
                setValue('match_rain_status', matchDatas && matchDatas.match_rain_status ? true : false)   
                setValue('match_completed_status', matchDatas && matchDatas.match_completed && matchDatas.match_completed.status ? true : false)
                setValue('match_tied_status', matchDatas && matchDatas.match_tied && matchDatas.match_tied.status ? true : false)
                setValue('scroller', matchDatas && matchDatas.scroller ? matchDatas.scroller : '')
                setValue('fav_team', matchDatas && matchDatas.fav_team ? matchDatas.fav_team : '')
                setValue('tips', matchDatas && matchDatas.tips ? matchDatas.tips : '')
                setFancyInfo(matchDatas && matchDatas.fancy_info ? matchDatas.fancy_info : fancyInfo)
                setSuspendAll(matchDatas && matchDatas.suspend_all ? matchDatas.suspend_all : '')
            }
        });
    }, []);
    
    const setAddBreak = async (value) => {
        if(value) {
            const docRef = doc(db, "matchdata", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let dataValue = {
                    int_ad_brk: value
                }
                await setDoc(doc(db, "matchdata", id), dataValue, {merge: true});
            }
            let dataValue = {
                int_ad_brk: false
            }
            setTimeout(async () => {
                await setDoc(doc(db, "matchdata", id), dataValue, {merge: true});
            }, "1000");
        }
    }
    const batsManOneStrikeCalc = () => {
        const batsManOneRuns = getValues('batsman_1_runs')
        const batsmanOneBalls = getValues('batsman_1_balls')
        const batsmanOneStrikeRate = batsManOneRuns/batsmanOneBalls*100 
        setValue('batsman_1_strike_rate', batsmanOneStrikeRate.toFixed(2)); 
        handleSubmitData();
    }
    const batsManTwoStrikeCalc = () => {
        const batsManTwoRuns = getValues('batsman_2_runs')
        const batsmanTwoBalls = getValues('batsman_2_balls')
        const batsmanTwoStrikeRate = batsManTwoRuns/batsmanTwoBalls*100 
        setValue('batsman_2_strike_rate', batsmanTwoStrikeRate.toFixed(2)); 
        handleSubmitData();
    }
    const addFancyData = () => {
        let fancyItem = {
            over: false,
            suspend: false,
            s_over: 0,
            s_min: 0,
            s_max: 0,
            s_min_rate: 0,
            s_max_rate: 0
        }
        let updatedFancyData = [...fancyInfo, fancyItem];
        setFancyInfo(updatedFancyData);
        setTimeout(() => {
            handleSubmitData();
        }, 0);
    }    
    const setFancyInfoIndexWise = (index, item, itemType) => {
        let updatedFancyData = [...fancyInfo];
        if(itemType == 'over' && item !== 'plus' && item !== 'minus') {
            updatedFancyData[index].over = item
        } else if (itemType == 'suspend' && item !== 'plus' && item !== 'minus') {
            updatedFancyData[index].suspend = item
        } else if (itemType == 's_over' && item !== 'plus' && item !== 'minus') {
            updatedFancyData[index].s_over = item
        } else if (itemType == 's_min' && item !== 'plus' && item !== 'minus') {
            updatedFancyData[index].s_min = Number(item)
            updatedFancyData[index].s_max = Number(item) + 1
        } else if (itemType == 's_max' && item !== 'plus' && item !== 'minus') {
            updatedFancyData[index].s_max = Number(item)
        } else if (itemType == 's_min' && item === 'plus') {
            updatedFancyData[index].s_min = Number(updatedFancyData[index].s_min) + 1
            updatedFancyData[index].s_max = Number(updatedFancyData[index].s_max) + 1
        } else if (itemType == 's_min' && item === 'minus') {
            updatedFancyData[index].s_min = Number(updatedFancyData[index].s_min) - 1
            updatedFancyData[index].s_max = Number(updatedFancyData[index].s_max) - 1
        } else if (itemType == 's_max' && item === 'plus') {
            updatedFancyData[index].s_max = Number(updatedFancyData[index].s_max) + 1
        } else if (itemType == 's_max' && item === 'minus') {
            updatedFancyData[index].s_max = Number(updatedFancyData[index].s_max) - 1
        } 
        if(updatedFancyData[index].s_min == updatedFancyData[index].s_max){
            updatedFancyData[index].s_min_rate = 110
            updatedFancyData[index].s_max_rate = 90
        } else {
            updatedFancyData[index].s_min_rate = 100
            updatedFancyData[index].s_max_rate = 100
        }
        setFancyInfo(updatedFancyData);
        setTimeout(() => {
            handleSubmitData();
        }, 0);
    }
    const setSuspendAllFun = (suspendStatus) => {
        setSuspendAll(suspendStatus);
        let updatedFancyData = [...fancyInfo];
        updatedFancyData.map((item, index) => {
            updatedFancyData[index].suspend = suspendStatus
        });
        setFancyInfo(updatedFancyData);
        setTimeout(() => {
            handleSubmitData();
        }, 0);
    }
    const removeFancyInfo = (i) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this info!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isConfirm) => {
            if(isConfirm){
                let updatedFancyData = [...fancyInfo];
                updatedFancyData.pop(i);
                setFancyInfo(updatedFancyData);
                setTimeout(() => {
                    handleSubmitData();
                }, 0);
            }
        })
    }
    const setMatchOddData = () => {
        const oddTeamOneTextOne = getValues('match_odd_team_1_text_1');
        const oddTeamTwoTextOne = getValues('match_odd_team_2_text_1');
        const oddDiff = getValues('odds_difference');
        const oddCalcTeamOne = Number(oddTeamOneTextOne) + Number(oddDiff);
        const oddCalcTeamTwo = Number(oddTeamTwoTextOne) + Number(oddDiff);
        if(oddTeamOneRadio) {
            setValue('match_odd_team_1_text_2', oddCalcTeamOne)
            const back1 = ((Number(getValues('match_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('back1', back1 == 'Infinity' ? '' : back1);
            setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('back2', back2 == 'Infinity' ? '' : back2);
            setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            setValue('match_odd_team_2_text_2', oddCalcTeamTwo)
            const back1 = (1 / Number(getValues('match_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('back1', back1 == 'Infinity' ? '' : back1);
            setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('back2', back2 == 'Infinity' ? '' : back2);
            setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const setMatchComOddData = () => {
        const oddTeamOneTextOne = getValues('match_com_odd_team_1_text_1');
        const oddTeamTwoTextOne = getValues('match_com_odd_team_2_text_1');
        const oddDiff = getValues('match_complete_odd_diff');
        const oddCalcTeamOne = Number(oddTeamOneTextOne) + Number(oddDiff);
        const oddCalcTeamTwo = Number(oddTeamTwoTextOne) + Number(oddDiff);
        if(oddComTeamOneRadio) {
            setValue('match_com_odd_team_1_text_2', oddCalcTeamOne)
            const back1 = ((Number(getValues('match_com_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_com_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_com_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_com_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            setValue('match_com_odd_team_2_text_2', oddCalcTeamTwo)
            const back1 = (1 / Number(getValues('match_com_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_com_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_com_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_com_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const setMatchTiedOddData = () => {
        const oddTeamOneTextOne = getValues('match_tied_odd_team_1_text_1');
        const oddTeamTwoTextOne = getValues('match_tied_odd_team_2_text_1');
        const oddDiff = getValues('match_tied_odd_diff');
        const oddCalcTeamOne = Number(oddTeamOneTextOne) + Number(oddDiff);
        const oddCalcTeamTwo = Number(oddTeamTwoTextOne) + Number(oddDiff);
        if(oddTiedTeamOneRadio) {
            setValue('match_tied_odd_team_1_text_2', oddCalcTeamOne)
            const back1 = ((Number(getValues('match_tied_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_tied_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_tied_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_tied_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            setValue('match_tied_odd_team_2_text_2', oddCalcTeamTwo)
            const back1 = (1 / Number(getValues('match_tied_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_tied_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_tied_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_tied_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const handleMatchRainPlusMinus = (type) => {
        const oddTeamOneTextOne = getValues('match_odd_team_1_text_1')
        const oddTeamOneTextTwo = getValues('match_odd_team_1_text_2')
        const oddTeamTwoTextOne = getValues('match_odd_team_2_text_1')
        const oddTeamTwoTextTwo = getValues('match_odd_team_2_text_2')
        
        if(oddTeamOneRadio && type === 'plus') {
            setValue('match_odd_team_1_text_1', Number(oddTeamOneTextOne) + 1)
            setValue('match_odd_team_1_text_2', Number(oddTeamOneTextTwo) + 1)
        } else if(oddTeamOneRadio && type === 'minus') {
            if(Number(oddTeamOneTextOne) == 0) return
            setValue('match_odd_team_1_text_1', Number(oddTeamOneTextOne) - 1)
            setValue('match_odd_team_1_text_2', Number(oddTeamOneTextTwo) - 1)
        } else if(oddTeamTwoRadio && type === 'plus') {
            setValue('match_odd_team_2_text_1', Number(oddTeamTwoTextOne) + 1)
            setValue('match_odd_team_2_text_2', Number(oddTeamTwoTextTwo) + 1)
        } else {
            if(Number(oddTeamTwoTextOne) == 0) return
            setValue('match_odd_team_2_text_1', Number(oddTeamTwoTextOne) - 1)
            setValue('match_odd_team_2_text_2', Number(oddTeamTwoTextTwo) - 1)
        } 
        
        if(oddTeamOneRadio){
            const back1 = ((Number(getValues('match_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('back1', back1 == 'Infinity' ? '' : back1);
            setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('back2', back2 == 'Infinity' ? '' : back2);
            setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            const back1 = (1 / Number(getValues('match_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('back1', back1 == 'Infinity' ? '' : back1);
            setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('back2', back2 == 'Infinity' ? '' : back2);
            setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const handleMatchComRainPlusMinus = (type) => {
        const oddTeamOneTextOne = getValues('match_com_odd_team_1_text_1')
        const oddTeamOneTextTwo = getValues('match_com_odd_team_1_text_2')
        const oddTeamTwoTextOne = getValues('match_com_odd_team_2_text_1')
        const oddTeamTwoTextTwo = getValues('match_com_odd_team_2_text_2')

        if(oddComTeamOneRadio && type === 'plus') {
            setValue('match_com_odd_team_1_text_1', Number(oddTeamOneTextOne) + 1)
            setValue('match_com_odd_team_1_text_2', Number(oddTeamOneTextTwo) + 1)
        } else if(oddComTeamOneRadio && type === 'minus') {
            if(Number(oddTeamOneTextOne) == 0) return
            setValue('match_com_odd_team_1_text_1', Number(oddTeamOneTextOne) - 1)
            setValue('match_com_odd_team_1_text_2', Number(oddTeamOneTextTwo) - 1)
        } else if(oddComTeamTwoRadio && type === 'plus') {
            setValue('match_com_odd_team_2_text_1', Number(oddTeamTwoTextOne) + 1)
            setValue('match_com_odd_team_2_text_2', Number(oddTeamTwoTextTwo) + 1)
        } else {
            if(Number(oddTeamTwoTextOne) == 0) return
            setValue('match_com_odd_team_2_text_1', Number(oddTeamTwoTextOne) - 1)
            setValue('match_com_odd_team_2_text_2', Number(oddTeamTwoTextTwo) - 1)
        } 

        if(oddComTeamOneRadio) {
            const back1 = ((Number(getValues('match_com_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_com_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_com_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_com_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            const back1 = (1 / Number(getValues('match_com_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_com_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_com_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_com_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const handleMatchTiedRainPlusMinus = (type) => {
        const oddTeamOneTextOne = getValues('match_tied_odd_team_1_text_1')
        const oddTeamOneTextTwo = getValues('match_tied_odd_team_1_text_2')
        const oddTeamTwoTextOne = getValues('match_tied_odd_team_2_text_1')
        const oddTeamTwoTextTwo = getValues('match_tied_odd_team_2_text_2')

        if(oddTiedTeamOneRadio && type === 'plus') {
            setValue('match_tied_odd_team_1_text_1', Number(oddTeamOneTextOne) + 1)
            setValue('match_tied_odd_team_1_text_2', Number(oddTeamOneTextTwo) + 1)
        } else if(oddTiedTeamOneRadio && type === 'minus') {
            if(Number(oddTeamOneTextOne) == 0) return
            setValue('match_tied_odd_team_1_text_1', Number(oddTeamOneTextOne) - 1)
            setValue('match_tied_odd_team_1_text_2', Number(oddTeamOneTextTwo) - 1)
        } else if(oddTiedTeamTwoRadio && type === 'plus') {
            setValue('match_tied_odd_team_2_text_1', Number(oddTeamTwoTextOne) + 1)
            setValue('match_tied_odd_team_2_text_2', Number(oddTeamTwoTextTwo) + 1)
        } else {
            if(Number(oddTeamTwoTextOne) == 0) return
            setValue('match_tied_odd_team_2_text_1', Number(oddTeamTwoTextOne) - 1)
            setValue('match_tied_odd_team_2_text_2', Number(oddTeamTwoTextTwo) - 1)
        } 

        if(oddTiedTeamOneRadio) {
            const back1 = ((Number(getValues('match_tied_odd_team_1_text_1')) / 100) + 1).toFixed(2);
            const lay1 = ((Number(getValues('match_tied_odd_team_1_text_2')) / 100) + 1).toFixed(2);
            const back2 = (1 / Number(getValues('match_tied_odd_team_1_text_2')) * 100 + 1).toFixed(2);
            const lay2 = (1 / Number(getValues('match_tied_odd_team_1_text_1')) * 100 + 1).toFixed(2);
            setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        } else {
            const back1 = (1 / Number(getValues('match_tied_odd_team_2_text_2')) * 100 + 1).toFixed(2);
            const lay1 = (1 / Number(getValues('match_tied_odd_team_2_text_1')) * 100 + 1).toFixed(2);
            const back2 = ((Number(getValues('match_tied_odd_team_2_text_1')) / 100) + 1).toFixed(2);
            const lay2 = ((Number(getValues('match_tied_odd_team_2_text_2')) / 100) + 1).toFixed(2);
            setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
            setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
            setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
            setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
        }
        handleSubmitData();
    }
    const setOddTeamOneTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamOneTextOne = getValues('match_odd_team_1_text_1');
            const oddDiff = getValues('odds_difference');
            if(oddDiff){
                const oddCalc = Number(oddTeamOneTextOne) + Number(oddDiff);
                setValue('match_odd_team_1_text_2', oddCalc)
            } else {
                setValue('match_odd_team_1_text_2', Number(oddTeamOneTextOne) + 1)
            }
        }
    }
    const setOddComTeamOneTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamOneTextOne = getValues('match_com_odd_team_1_text_1');
            const oddDiff = getValues('match_complete_odd_diff');
            if(oddDiff){
                const oddCalc = Number(oddTeamOneTextOne) + Number(oddDiff);
                setValue('match_com_odd_team_1_text_2', oddCalc)
            } else {
                setValue('match_com_odd_team_1_text_2', Number(oddTeamOneTextOne) + 1)
            }
        }
    }
    const setOddTiedTeamOneTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamOneTextOne = getValues('match_tied_odd_team_1_text_1');
            const oddDiff = getValues('match_tied_odd_diff');
            if(oddDiff){
                const oddCalc = Number(oddTeamOneTextOne) + Number(oddDiff);
                setValue('match_tied_odd_team_1_text_2', oddCalc)
            } else {
                setValue('match_tied_odd_team_1_text_2', Number(oddTeamOneTextOne) + 1)
            }
        }
    }
    const setOddTeamTwoTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamTwoTextOne = getValues('match_odd_team_2_text_1');
            const oddDiff = getValues('odds_difference');
            if(oddDiff){
                const oddCalc = Number(oddTeamTwoTextOne) + Number(oddDiff);
                setValue('match_odd_team_2_text_2', oddCalc);
            } else {
                setValue('match_odd_team_2_text_2', Number(oddTeamTwoTextOne) + 1)
            }
        }
    } 
    const setOddComTeamTwoTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamTwoTextOne = getValues('match_com_odd_team_2_text_1');
            const oddDiff = getValues('match_complete_odd_diff');
            if(oddDiff){
                const oddCalc = Number(oddTeamTwoTextOne) + Number(oddDiff);
                setValue('match_com_odd_team_2_text_2', oddCalc);
            } else {
                setValue('match_com_odd_team_2_text_2', Number(oddTeamTwoTextOne) + 1)
            }
        }
    }  
    const setOddTiedTeamTwoTextOneFun = (event) => {
        if (event.key === 'Enter') {
            const oddTeamTwoTextOne = getValues('match_tied_odd_team_2_text_1');
            const oddDiff = getValues('match_tied_odd_diff');
            if(oddDiff){
                const oddCalc = Number(oddTeamTwoTextOne) + Number(oddDiff);
                setValue('match_tied_odd_team_2_text_2', oddCalc);
            } else {
                setValue('match_tied_odd_team_2_text_2', Number(oddTeamTwoTextOne) + 1)
            }
        }
    }   
    const handleSubmitData = () => {
        document.getElementById("mySubmitBtn").click();
    }
    const setTvValues = (event) => {
        if(getValues('first_circle') === 'Wicket +') {
            setValue('first_circle', 'Wicket + ' + event.target.value)
        } else if(getValues('first_circle') === 'No Ball +') {
            setValue('first_circle', 'No Ball + ' + event.target.value)
        } else if(getValues('first_circle') === 'Wide +') {
            setValue('first_circle', 'Wide + ' + event.target.value)
        } else {
            setValue('first_circle', event.target.value)
        }
        handleSubmitData()
    }
    const setRunsToBatsmanAndbowlersEconomy = (value) => {  
        // var x = Number(getValues('bowler_overs'));
        // var int_x_part = Math.trunc(x); 
        // var float_x_part = Number((x-int_x_part).toFixed(2))
        // const totalXOver = int_x_part;
        // const totalXSplitOver = Number((float_x_part + "").split(".")[1]);
        
        // var y = Number(getValues('team_curr_ovr'));
        // var int_y_part = Math.trunc(y); 
        // var float_y_part = Number((y-int_y_part).toFixed(2))
        // const totalYOver = int_y_part;
        // const totalYSplitOver = Number((float_y_part + "").split(".")[1]);
        
        // if(totalXSplitOver && totalXSplitOver < 5 && typeof(value) === 'number'){
        //     setValue('bowler_overs', (x + 0.1).toFixed(1))
        // } else if (float_x_part === 0 && typeof(value) === 'number') {
        //     setValue('bowler_overs', (x + 0.1).toFixed(1))
        // } else if(typeof(value) === 'number') {
        //     setValue('bowler_overs', (totalXOver + 1).toFixed(1))
        // }

        // if(totalYSplitOver && totalYSplitOver < 5 && typeof(value) === 'number' && flagPlus === false){
        //     setValue('team_curr_ovr', (y + 0.1).toFixed(1))
        // } else if (float_y_part === 0 && typeof(value) === 'number' && flagPlus === false) {
        //     setValue('team_curr_ovr', (y + 0.1).toFixed(1))
        // } else if(typeof(value) === 'number' && flagPlus === false) {
        //     setValue('team_curr_ovr', (totalYOver + 1).toFixed(1))
        // }

        // setValue('team_runs', Number(getValues('team_runs')) + value)
        
        // if(getValues('on_strike') === '0' && typeof(value) === 'number'){
        //     setValue('batsman_1_balls', Number(getValues('batsman_1_balls')) + 1)
        //     setValue('batsman_1_runs', Number(getValues('batsman_1_runs')) + value)
        //     setValue('bowler_runs', Number(getValues('bowler_runs')) + value)
        //     if(value === 4) {
        //         setValue('batsman_1_4s', Number(getValues('batsman_1_4s')) + 1)
        //     } else if(value === 6) {
        //         setValue('batsman_1_6s', Number(getValues('batsman_1_6s')) + 1)
        //     }
        // } else if(getValues('on_strike') === '1' && typeof(value) === 'number') {
        //     setValue('batsman_2_balls', Number(getValues('batsman_2_balls')) + 1)
        //     setValue('batsman_2_runs', Number(getValues('batsman_2_runs')) + value)
        //     setValue('bowler_runs', Number(getValues('bowler_runs')) + value)
        //     if(value === 4) {
        //         setValue('batsman_2_4s', Number(getValues('batsman_2_4s')) + 1)
        //     } else if(value === 6) {
        //         setValue('batsman_2_6s', Number(getValues('batsman_2_6s')) + 1)
        //     }
        // }
        
        // if(value === 'WD' || value === 'NB'){
        //     setValue('team_runs', Number(getValues('team_runs'))+1)
        // } 
        // if(value === 'Wkt' || value === 'Wkt+' || value === 'St.Out' || value === 'R.Out' || value === 'LBW Out') {
        //     setValue('team_wickets', Number(getValues('team_wickets'))+1)
        // }
        flagPlus = false;
    }
    const setWideAndNoBallPlus = () => {
        flagPlus = true;
        setValue('team_runs', Number(getValues('team_runs'))+1)
    }
    const isObjectEmpty = (objectName) => {
        return Object.keys(objectName).length === 0
    }
    const setBowlerReset = () => {
        setValue('bowler', '')
        setValue('bowler_wicket', '')
        setValue('bowler_runs', '')
        setValue('bowler_overs', '')
        setValue('bowlers_economy', '')
        handleSubmitData();
    }
    const setBatsmanOneData = () => {
        setValue('batsman_1', '')
        setValue('batsman_1_balls', '')
        setValue('batsman_1_runs', '')
        setValue('batsman_1_strike_rate', '')
        setValue('batsman_1_4s', '')
        setValue('batsman_1_6s', '')
        handleSubmitData();
    }
    const setBatsmanTwoReset = () => {
        setValue('batsman_2', '')
        setValue('batsman_2_balls', '')
        setValue('batsman_2_runs', '')
        setValue('batsman_2_strike_rate', '')
        setValue('batsman_2_4s', '')
        setValue('batsman_2_6s', '')
        handleSubmitData();
    }
    const fetchOnBattingTeam = (team_id) => {
        setValue('batting_team', team_id)
        // let totalOverBalls = Number(getValues('match_over')) * 6
        // if(team_id == getValues('team_a_id')) {
        //     let teamAScore = getValues('team_a_score');
        //     let teamAScoreOver = getValues('team_a_scores_over');
        //     setValue('team_runs', teamAScore[1].score);
        //     setValue('team_wickets', teamAScore[1].wicket);
        //     setValue('team_curr_ovr', teamAScoreOver[0].over);
        //     setValue('team_total_ovr', getValues('match_over'));
        //     if(getValues('target')){
        //         setValue('team_run_need', Number(getValues('target')) - Number(getValues('team_runs')));
        //     }
        //     var z = Number(getValues('team_curr_ovr'));
        //     var int_z_part = Math.trunc(z); 
        //     var float_z_part = Number((z-int_z_part).toFixed(2))
        //     const totalZOver = int_z_part;
        //     const totalZSplitOver = Number((float_z_part + "").split(".")[1]);
            
        //     if(float_z_part === 0){
        //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - (Number(totalZOver) * 6) : '')
        //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / Number(totalZOver))).toFixed(2) : '')
        //     } else {
        //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - ((Number(totalZOver) * 6) + totalZSplitOver) : '')
        //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / ((totalZSplitOver/6) + totalZOver))).toFixed(2) : '')
        //     }
        //     setValue('team_rr_rate',  getValues('team_run_need') && getValues('team_rem_balls') ? (Number(getValues('team_run_need') / Number(getValues('team_rem_balls'))) * 6).toFixed(2) : '')
        // } else if(team_id == getValues('team_b_id')) {
        //     let teamBScore = getValues('team_b_score');
        //     let teamBScoreOver = getValues('team_b_scores_over');
        //     setValue('team_runs', teamBScore[2].score);
        //     setValue('team_wickets', teamBScore[2].wicket);
        //     setValue('team_curr_ovr', teamBScoreOver[0].over);
        //     setValue('team_total_ovr', getValues('match_over'));
        //     if(getValues('target')){
        //         setValue('team_run_need', Number(getValues('target')) - Number(getValues('team_runs')));
        //     }
        //     var z = Number(getValues('team_curr_ovr'));
        //     var int_z_part = Math.trunc(z); 
        //     var float_z_part = Number((z-int_z_part).toFixed(2))
        //     const totalZOver = int_z_part;
        //     const totalZSplitOver = Number((float_z_part + "").split(".")[1]);
        //     if(float_z_part === 0){
        //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - (Number(totalZOver) * 6) : '')
        //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / Number(totalZOver))).toFixed(2) : '')
        //     } else {
        //         setValue('team_rem_balls', totalOverBalls ? totalOverBalls - ((Number(totalZOver) * 6) + totalZSplitOver) : '')
        //         setValue('team_curr_rate', getValues('team_runs') ? (Number(getValues('team_runs') / ((totalZSplitOver/6) + totalZOver))).toFixed(2) : '')
        //     }
        //     setValue('team_rr_rate', getValues('team_run_need') && getValues('team_rem_balls') ? (Number(getValues('team_run_need') / Number(getValues('team_rem_balls'))) * 6).toFixed(2) : '')
        // }
        handleSubmitData();
    }
    const handleRainStatus = (e) => {
        setValue('match_rain_status', e.target.checked);
        setValue('match_tied_status', false)
        setValue('match_completed_status', false)
        handleSubmitData();
    }
    const handleAPIs = (e, data) => {
        const disabledFlag = e.target.checked ? false : true
        const params = {
            match_id: Number(id),
            is_disable: disabledFlag,
            endpoint: data
        }
        const apiConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
            axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_NODE_DEV_API_URL}/disable-api` : `${process.env.REACT_APP_NODE_API_URL}/disable-api`, JSON.stringify(params), apiConfig)
            .then((response) => {
                if(response.data.success){
                    toast.success(response.data.message);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
            if(data === 'commentary'){
                setValue('commentary_api', e.target.checked);
            } else if(data === 'match-odds') {
                setValue('match_odds_api', e.target.checked);
            } else if(data === 'session') {
                setValue('session_api', e.target.checked);
            }
        } catch (error) {
            console.log("handleAPIs", error)
        }
        handleSubmitData();
    }
    const setMatchOddDataField = (value) => {
        if(value === 'team_a_short') {
            setValue('fav_team', getValues('team_a_short'));
            if(getValues('odds_difference')) {
                setValue('match_odd_team_1_text_2', Number(getValues('match_odd_team_1_text_1')) + Number(getValues('odds_difference')));
            } else {
                setValue('match_odd_team_1_text_2', Number(getValues('match_odd_team_1_text_1')) + 1);
            }
            if(Number(getValues('match_odd_team_1_text_1')) < 0) return
            if(Number(getValues('match_odd_team_1_text_1')) == 0) {
                const back1 = '';
                const lay1 = ((Number(getValues('match_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = 1000;
                const lay2 = '';
                setValue('back1', back1 == 'Infinity' ? '' : back1);
                setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('back2', back2 == 'Infinity' ? '' : back2);
                setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_odd_team_1_text_1') && Number(getValues('match_odd_team_1_text_1')) > 0) {
                const back1 = ((Number(getValues('match_odd_team_1_text_1')) / 100) + 1).toFixed(2);
                const lay1 = ((Number(getValues('match_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = (1 / Number(getValues('match_odd_team_1_text_2')) * 100 + 1).toFixed(2);
                const lay2 = (1 / Number(getValues('match_odd_team_1_text_1')) * 100 + 1).toFixed(2);
                setValue('back1', back1 == 'Infinity' ? '' : back1);
                setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('back2', back2 == 'Infinity' ? '' : back2);
                setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        } else {
            setValue('fav_team', getValues('team_b_short'));
            if(getValues('odds_difference')) {
                setValue('match_odd_team_2_text_2', Number(getValues('match_odd_team_2_text_1')) + Number(getValues('odds_difference')));
            } else {
                setValue('match_odd_team_2_text_2', Number(getValues('match_odd_team_2_text_1')) + 1);
            }
            if(Number(getValues('match_odd_team_2_text_1')) < 0) return
            if(Number(getValues('match_odd_team_2_text_1')) == 0) {
                const back1 = 1000;
                const lay1 = '';
                const back2 = '';
                const lay2 = ((Number(getValues('match_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('back1', back1 == 'Infinity' ? '' : back1);
                setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('back2', back2 == 'Infinity' ? '' : back2);
                setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_odd_team_2_text_1') && Number(getValues('match_odd_team_2_text_1')) > 0) {
                const back1 = (1 / Number(getValues('match_odd_team_2_text_2')) * 100 + 1).toFixed(2);
                const lay1 = (1 / Number(getValues('match_odd_team_2_text_1')) * 100 + 1).toFixed(2);
                const back2 = ((Number(getValues('match_odd_team_2_text_1')) / 100) + 1).toFixed(2);
                const lay2 = ((Number(getValues('match_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('back1', back1 == 'Infinity' ? '' : back1);
                setValue('lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('back2', back2 == 'Infinity' ? '' : back2);
                setValue('lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        }
        handleSubmitData();
    }
    const setMatchCompletedDataField = (value) =>{
        if(value === 'yes') {
            setValue('match_completed', 'yes');
            if(getValues('match_complete_odd_diff')) {
                setValue('match_com_odd_team_1_text_2', Number(getValues('match_com_odd_team_1_text_1')) + Number(getValues('match_complete_odd_diff')));
            } else {
                setValue('match_com_odd_team_1_text_2', Number(getValues('match_com_odd_team_1_text_1')) + 1);
            }
            if(Number(getValues('match_com_odd_team_1_text_1')) < 0) return
            if(Number(getValues('match_com_odd_team_1_text_1')) == 0) {
                const back1 = '';
                const lay1 = ((Number(getValues('match_com_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = 1000;
                const lay2 = '';
                setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_com_odd_team_1_text_1') && Number(getValues('match_com_odd_team_1_text_1')) > 0) {
                const back1 = ((Number(getValues('match_com_odd_team_1_text_1')) / 100) + 1).toFixed(2);
                const lay1 = ((Number(getValues('match_com_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = (1 / Number(getValues('match_com_odd_team_1_text_2')) * 100 + 1).toFixed(2);
                const lay2 = (1 / Number(getValues('match_com_odd_team_1_text_1')) * 100 + 1).toFixed(2);
                setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        } else {
            setValue('match_completed', 'no');
            if(getValues('match_complete_odd_diff')) {
                setValue('match_com_odd_team_2_text_2', Number(getValues('match_com_odd_team_2_text_1')) + Number(getValues('match_complete_odd_diff')));
            } else {
                setValue('match_com_odd_team_2_text_2', Number(getValues('match_com_odd_team_2_text_1')) + 1);
            }
            if(Number(getValues('match_com_odd_team_2_text_1')) < 0) return
            if(Number(getValues('match_com_odd_team_2_text_1')) == 0) {
                const back1 = 1000;
                const lay1 = '';
                const back2 = '';
                const lay2 = ((Number(getValues('match_com_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1 == 'Infinity' ? '' : back1);
                setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1 == 'Infinity' ? '' : lay1);
                setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2 == 'Infinity' ? '' : back2);
                setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_com_odd_team_2_text_1') && Number(getValues('match_com_odd_team_2_text_1')) > 0) {
                const back1 = (1 / Number(getValues('match_com_odd_team_2_text_2')) * 100 + 1).toFixed(2);
                const lay1 = (1 / Number(getValues('match_com_odd_team_2_text_1')) * 100 + 1).toFixed(2);
                const back2 = ((Number(getValues('match_com_odd_team_2_text_1')) / 100) + 1).toFixed(2);
                const lay2 = ((Number(getValues('match_com_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('mc_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mc_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mc_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mc_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        }
        handleSubmitData();
    }
    const setMatchTiedDataField = (value) =>{
        if(value === 'yes') {
            setValue('match_tied', 'yes');
            if(getValues('match_tied_odd_diff')) {
                setValue('match_tied_odd_team_1_text_2', Number(getValues('match_tied_odd_team_1_text_1')) + Number(getValues('match_tied_odd_diff')));
            } else {
                setValue('match_tied_odd_team_1_text_2', Number(getValues('match_tied_odd_team_1_text_1')) + 1);
            } 
            if(Number(getValues('match_tied_odd_team_1_text_1')) < 0) return
            if(Number(getValues('match_tied_odd_team_1_text_1')) == 0) {
                const back1 = '';
                const lay1 = ((Number(getValues('match_tied_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = 1000;
                const lay2 = '';
                setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_tied_odd_team_1_text_1') && Number(getValues('match_tied_odd_team_1_text_1')) > 0) {
                const back1 = ((Number(getValues('match_tied_odd_team_1_text_1')) / 100) + 1).toFixed(2);
                const lay1 = ((Number(getValues('match_tied_odd_team_1_text_2')) / 100) + 1).toFixed(2);
                const back2 = (1 / Number(getValues('match_tied_odd_team_1_text_2')) * 100 + 1).toFixed(2);
                const lay2 = (1 / Number(getValues('match_tied_odd_team_1_text_1')) * 100 + 1).toFixed(2);
                setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        } else {
            setValue('match_tied', 'no');
            if(getValues('match_tied_odd_diff')) {
                setValue('match_tied_odd_team_2_text_2', Number(getValues('match_tied_odd_team_2_text_1')) + Number(getValues('match_tied_odd_diff')));
            } else {
                setValue('match_tied_odd_team_2_text_2', Number(getValues('match_tied_odd_team_2_text_1')) + 1);
            }
            if(Number(getValues('match_tied_odd_team_2_text_1')) < 0) return
            if(Number(getValues('match_tied_odd_team_2_text_1')) == 0) {
                console.log('ff')
                const back1 = 1000;
                const lay1 = '';
                const back2 = '';
                const lay2 = ((Number(getValues('match_tied_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            } else if(getValues('match_tied_odd_team_2_text_1') && Number(getValues('match_tied_odd_team_2_text_1')) > 0) {
                const back1 = (1 / Number(getValues('match_tied_odd_team_2_text_2')) * 100 + 1).toFixed(2);
                const lay1 = (1 / Number(getValues('match_tied_odd_team_2_text_1')) * 100 + 1).toFixed(2);
                const back2 = ((Number(getValues('match_tied_odd_team_2_text_1')) / 100) + 1).toFixed(2);
                const lay2 = ((Number(getValues('match_tied_odd_team_2_text_2')) / 100) + 1).toFixed(2);
                setValue('mt_odd_back1', back1 == 'Infinity' ? '' : back1);
                setValue('mt_odd_lay1', lay1 == 'Infinity' ? '' : lay1);
                setValue('mt_odd_back2', back2 == 'Infinity' ? '' : back2);
                setValue('mt_odd_lay2', lay2 == 'Infinity' ? '' : lay2);
            }
        }
        handleSubmitData();
    }

    const setPitchReport = (value) => {
        setValue('pitch_report', value);
    }
    const handleSubmitPitchData = () => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        const params = {
            match_id: id,
            pitch_report: getValues('pitch_report') ? getValues('pitch_report') : ''
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success) {
                swal("Saved!", "Pitch Report Saved Successfully", "success");
                handleSubmitData();
            }
        }).catch((error) => {
            console.log("pitchReportError", error)
        });
    } 

    const sendWeatherData = () => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        const params = {
            match_id: id,
            weather: getValues('weather') ? getValues('weather') : ''
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success) {
                swal("Saved!", 'Weather Saved Successfully', "success");
                handleSubmitData();
            }
        }).catch((error) => {
            console.log("pitchReportError", error)
        });
    } 
    
    return (
        <div className="live-match-container p-0">
            <a href='/' className='ml-3'>Dashboard</a> | <a href='/live-matches'>Live Matches</a> | <a href="/">Logout</a>
            <hr className='m-0 mb-2'/>
            <section className="content p-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className='live-match-page'>
                                    <div className='container custom-container'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='card'>
                                                    <div className='card-header custom-card-header'>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <input type="text" className='custom-text-box-auto' placeholder='Bat 1' {...register("batsman_1")}/> 

                                                                <span className='btn btn-danger out-btn ms-2' onClick={()=>{setBatsmanOneData()}}>Out</span>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <input type="text" className='custom-text-box-auto' placeholder='Bat 2' {...register("batsman_2")}/> 
                                                                
                                                                <span className='btn btn-danger out-btn ms-2' onClick={()=>{setBatsmanTwoReset()}}>Out</span>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <input type="text" className='custom-text-box-auto' placeholder='Bowl' {...register("bowler")}/> 
                                                                <span className='btn btn-danger out-btn ms-2' onClick={()=>{setBowlerReset()}}>Over</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body custom-card-body'>
                                                        <div className='row'>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Strike 1:</label>
                                                                    <input
                                                                        {...register('on_strike', {
                                                                            onChange: () => {
                                                                                handleSubmitData();
                                                                            }
                                                                        })}
                                                                        type="radio"
                                                                        name="on_strike"
                                                                        value="0"
                                                                        className="form-check-input"
                                                                    />
                                                                </div>
                                                                <div className=''>
                                                                    <label>Balls:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Balls' {...register("batsman_1_balls", {
                                                                        onBlur: (e) => {
                                                                            batsManOneStrikeCalc(e);
                                                                        }
                                                                    })} /> 
                                                                </div> 
                                                                <div>
                                                                    <label>Runs:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Runs' {...register("batsman_1_runs", {
                                                                        onBlur: (e) => {
                                                                            batsManOneStrikeCalc(e);
                                                                        }
                                                                    })} /> 
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Strike 2:</label>
                                                                    <input
                                                                        {...register('on_strike', {
                                                                            onChange: () => {
                                                                                handleSubmitData();
                                                                            }
                                                                        })}
                                                                        type="radio"
                                                                        name="on_strike"
                                                                        value="1"
                                                                        className="form-check-input"
                                                                    />
                                                                </div>
                                                                <div className=''>
                                                                    <label>Balls:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Balls' {...register("batsman_2_balls", {
                                                                        onBlur: (e) => {
                                                                            batsManTwoStrikeCalc(e);
                                                                        }
                                                                    })} /> 
                                                                </div> 
                                                                <div>
                                                                    <label>Runs:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Runs' {...register("batsman_2_runs", {
                                                                        onBlur: (e) => {
                                                                            batsManTwoStrikeCalc(e);
                                                                        }
                                                                    })} /> 
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Wickets:</label> <br/>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Wickets' {...register("bowler_wicket")}/> 
                                                                </div> 
                                                                <div>
                                                                    <label>Runs:</label> <br/>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Runs' {...register("bowler_runs")} /> 
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Strike Rate:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='S Rate' {...register("batsman_1_strike_rate")} /> 
                                                                </div>
                                                                <div className=''>
                                                                    <label>4s:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='4s' {...register("batsman_1_4s")} /> 
                                                                </div> 
                                                                <div>
                                                                    <label>6s:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='6s' {...register("batsman_1_6s")} /> 
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Strike Rate:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='S Rate' {...register("batsman_2_strike_rate")} /> 
                                                                </div>
                                                                <div className=''>
                                                                    <label>4s:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='4s' {...register("batsman_2_4s")} /> 
                                                                </div> 
                                                                <div>
                                                                    <label>6s:</label>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='6s' {...register("batsman_2_6s")} /> 
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4 d-flex'>
                                                                <div className=''>
                                                                    <label>Overs:</label> <br/>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Overs' {...register("bowler_overs")} /> 
                                                                </div> 
                                                                <div>
                                                                    <label>Economy:</label> <br/>
                                                                    <input type="text" className='custom-text-box ms-1' placeholder='Economy' {...register("bowlers_economy")} /> 
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-body p-0'>
                                                    <input rows="3" className='textarea-style mt-1' placeholder='Television' {...register("first_circle")}/>
                                                </div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div className='card'>
                                                    <div className='card-body custom-card-body'>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <div className=''>
                                                                    <label>Current Status:</label> <br/>
                                                                    <input className='custom-text-box-auto' type="text" placeholder='Toss Result' {...register("toss_result")}/>
                                                                    <input className='custom-text-box-auto' type="text" placeholder='Last Wicket' {...register("last_wicket")}/> 
                                                                    <input className='custom-text-score' type="text" placeholder='Runs' {...register("runs")}/>
                                                                    <input className='custom-text-score ms-2' type="text" placeholder='Balls' {...register("balls")}/>  
                                                                    <label>On Bat:</label> <br/>
                                                                    <input type='radio' {...register("batting_team")} defaultValue={getValues('team_a_id')} onChange={()=>{fetchOnBattingTeam(getValues('team_a_id'))}} checked={getValues('team_a_id') == onBatTeam}/> {getValues('team_a')}
                                                                    <input type='radio' {...register("batting_team")} defaultValue={getValues('team_b_id')} onChange={()=>{fetchOnBattingTeam(getValues('team_b_id'))}} className='ms-2' checked={getValues('team_b_id') == onBatTeam}/> {getValues('team_b')} <br/>
                                                                    <label>Scroller</label> <br/>
                                                                    <input type='text' className='custom-text-add' {...register("scroller")}/>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <input type="checkbox" className="form-check-input" {...register("commentary_api")} onChange={(e) => {handleAPIs(e, 'commentary');}} /> <label>Comentary API</label> <br/>
                                                                <input type="checkbox" className="form-check-input" {...register("match_odds_api")} onChange={(e) => {handleAPIs(e, 'match-odds');}}/> <label>Match Odds API</label>
                                                                <input type="checkbox" className='form-check-input ms-2' {...register("fancy_api")} onChange={(e) => {setValue('fancy_api', e.target.checked); handleSubmitData();}}/> <label>Fancy API</label>
                                                                <hr className='m-0 mt-3'/>
                                                                <label>Last 6 Ball:</label> <br/>
                                                                <label>Weather:</label> <br/>
                                                                <input className='custom-text-score' type="text" placeholder='Weather' {...register("weather")}/> <span className='btn btn-primary btn-runs-style-2' onClick={() => sendWeatherData()}>Send</span><br/>
                                                                <label>Tips</label> <br/>
                                                                <input type='text' className='custom-text-add' {...register("tips")}/>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='card score-card-disable'>
                                                                    <div className='card-header custom-card-header'>
                                                                        <label>Scorecard</label>
                                                                    </div>
                                                                    
                                                                    <div className='card-body custom-card-body'>
                                                                        <table>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Target</label> 
                                                                                </td>
                                                                                <td>
                                                                                    <input type="text" className='custom-text-score' {...register("target")} placeholder='Target'/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Runs/Wicket</label> 
                                                                                </td>
                                                                                <td className='d-flex'>
                                                                                    <input type="text" className='custom-text-box' placeholder='Runs' {...register("team_runs")}/>
                                                                                    <input type="text" className='custom-text-box' placeholder='Wickets' {...register("team_wickets")}/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Curr.Ovr/Total</label> 
                                                                                </td>
                                                                                <td className='d-flex'>
                                                                                    <input type="text" className='custom-text-box' placeholder='Curr Ovr' {...register("team_curr_ovr")}/>
                                                                                    <input type="text" className='custom-text-box' placeholder='Total Ovr' {...register("team_total_ovr")}/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Curr. Run Rate</label> 
                                                                                </td>
                                                                                <td>
                                                                                    <input type="text" className='custom-text-score' {...register("team_curr_rate")} placeholder='Crr. R. Rate'/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Run Needed</label> 
                                                                                </td>
                                                                                <td>
                                                                                    <input type="text" className='custom-text-score' {...register("team_run_need")} placeholder='R. Needed'/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>R. Run Rate</label> 
                                                                                </td>
                                                                                <td>
                                                                                    <input type="text" className='custom-text-score' {...register("team_rr_rate")} placeholder='R. Run Rate'/>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> 
                                                                                    <label>Rem. Balls</label> 
                                                                                </td>
                                                                                <td>
                                                                                    <input type="text" className='custom-text-score' placeholder='Rem. Balls' {...register("team_rem_balls")}/>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='row mt-1'>
                                            <div className='fancy-info-width'>
                                                <div className='card'>
                                                    <div className='card-header custom-card-header'>
                                                        <div className='row'>
                                                            <div className='col-md-6'>
                                                                <label>Fancy Info</label>
                                                            </div>
                                                            <div className='col-md-6 text-end'>
                                                                <input type="checkbox" className="form-check-input" onChange={()=>{setSuspendAllFun(!suspendAll)}} checked={suspendAll}/> <label>Suspend All</label>
                                                                <span className='btn btn-primary custom-btn ms-2' onClick={() => addFancyData()}>Add Item</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body custom-card-body'>
                                                        {fancyInfo && fancyInfo.length > 0  && fancyInfo.map((item, index) => (
                                                            <div className='row'>
                                                                <div className='col-md-5'>
                                                                    <label>Overs:#{index + 1}</label>
                                                                    <input type="checkbox" className="form-check-input" onChange={(e) => {setFancyInfoIndexWise(index, !item.over , 'over')}} checked={item.over}/><br/>
                                                                    <label>Suspend:#{index + 1} </label>
                                                                    <input type="checkbox" className="form-check-input" onChange={(e) => {setFancyInfoIndexWise(index, !item.suspend, 'suspend')}} checked={item.suspend}/><br/>
                                                                    <input type="text" className='custom-text-box-fancy small' value={item.s_over} onChange={(e) => {setFancyInfoIndexWise(index, e.target.value, 's_over')}}/>
                                                                </div>
                                                                <div className='col-md-3'>
                                                                    <label>N (90):</label> <br/>
                                                                    <span className='btn btn-secondary cross-btn' onClick={() => {setFancyInfoIndexWise(index, 'plus', 's_min')}}>+</span>
                                                                    <span className='btn btn-secondary cross-btn ms-1' onClick={() => {setFancyInfoIndexWise(index, 'minus', 's_min')}}>-</span>
                                                                    <input type="number" className='custom-text-box small' value={item.s_min} onChange={(e) => {setFancyInfoIndexWise(index, e.target.value, 's_min')}}/>
                                                                </div>
                                                                <div className='col-md-4'>
                                                                    <div className='custom-remove-sec'>
                                                                        <div className=''>
                                                                            <label>Y (11):</label> <br/>
                                                                            <span className='btn btn-secondary cross-btn' onClick={() => {setFancyInfoIndexWise(index, 'plus', 's_max')}}>+</span>
                                                                            <span className='btn btn-secondary cross-btn ms-1' onClick={() => {setFancyInfoIndexWise(index, 'minus', 's_max')}}>-</span>
                                                                            <input type="number" className='custom-text-box small' value={item.s_max} onChange={(e) => {setFancyInfoIndexWise(index, e.target.value, 's_max')}}/>
                                                                        </div>
                                                                        <div className='col-md-6 text-end'>
                                                                            {
                                                                                index > 1 &&
                                                                                <div className=''>
                                                                                    <span className='btn btn-danger cross-btn' onClick={()=> {removeFancyInfo(index)}}>X</span>
                                                                                </div>    
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='match-odd-width'>
                                                <div className='card'>
                                                    <div className='card-header custom-card-header'>
                                                        <div className='row'>
                                                            <div className='col-md-12'>
                                                                <label>Match Odds</label>

                                                                <input type="checkbox" className="ms-3 form-check-input" {...register("match_rain_status")} onChange={(e)=> {handleRainStatus(e)}}/> <label>Rain</label>
                                                                <input type="checkbox" className="ms-3 form-check-input" {...register("match_completed_status")} onChange={(e) => {setValue('match_completed_status', e.target.checked); handleSubmitData();}} /> <label>Match Completed</label>
                                                                <input type="checkbox" className="ms-3 form-check-input" {...register("match_tied_status")} onChange={(e) => {setValue('match_tied_status', e.target.checked); handleSubmitData();}} /> <label>Match Tied</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body custom-card-body'>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label>Odds Difference</label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" className='custom-text-box small' {...register("odds_difference", { onChange: (e) => {setValue('odds_difference', e.target.value)} })}/>
                                                                        <span className='btn btn-warning custom-btn-set ms-1' onClick={setMatchOddData}>Set</span>
                                                                    </td>
                                                                    <td>
                                                                        <span className='btn btn-secondary btn-plus-minus' onClick={()=>{handleMatchRainPlusMinus('plus')}}>+</span>
                                                                        <span className='btn btn-secondary btn-plus-minus ms-1' onClick={()=>{handleMatchRainPlusMinus('minus')}}>-</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value={getValues('team_a')}/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="text" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddTeamOneRadio(true); setOddTeamTwoRadio(false); setMatchOddDataField('team_a_short');}}
                                                                                onKeyDown={(e) => {setOddTeamOneTextOneFun(e);}}   
                                                                                {...register("match_odd_team_1_text_1")}
                                                                            /> 
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('back1')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="text" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddTeamOneRadio(true); setOddTeamTwoRadio(false); setOddTeamTwoRadio(false); setMatchOddDataField('team_a_short');}}
                                                                                {...register("match_odd_team_1_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('lay1')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddTeamOneRadio}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value={getValues('team_b')}/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="text" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddTeamOneRadio(false); setOddTeamTwoRadio(true); setMatchOddDataField('team_b_short');}}
                                                                                onKeyDown={(e) => {setOddTeamTwoTextOneFun(e)}}
                                                                                {...register("match_odd_team_2_text_1")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('back2')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="text" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddTeamOneRadio(false); setOddTeamTwoRadio(true);setMatchOddDataField('team_b_short');}}
                                                                                {...register("match_odd_team_2_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('lay2')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddTeamTwoRadio}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <hr className='mt-1 mb-1'/>
                                                    <div className='card-header custom-card-header'>
                                                        <label>Match Completed</label>
                                                    </div>
                                                    <div className='card-body custom-card-body'>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label>Odds Diferrence</label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" className='custom-text-box small' {...register("match_complete_odd_diff", { onChange: (e) => {setValue('match_complete_odd_diff', e.target.value)} })}/>
                                                                        <span className='btn btn-warning custom-btn-set ms-1' onClick={setMatchComOddData}>Set</span>
                                                                    </td>
                                                                    <td>
                                                                        <span className='btn btn-secondary btn-plus-minus' onClick={()=>{handleMatchComRainPlusMinus('plus')}}>+</span>
                                                                        <span className='btn btn-secondary btn-plus-minus ms-1' onClick={()=>{handleMatchComRainPlusMinus('minus')}}>-</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value="YES"/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddComTeamOneRadio(true); setOddComTeamTwoRadio(false); setMatchCompletedDataField('yes');}}
                                                                                onKeyDown={(e) => {setOddComTeamOneTextOneFun(e);}}   
                                                                                {...register("match_com_odd_team_1_text_1")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mc_odd_back1')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddComTeamOneRadio(true); setOddComTeamTwoRadio(false); setMatchCompletedDataField('yes')}}
                                                                                {...register("match_com_odd_team_1_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mc_odd_lay1')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddComTeamOneRadio} onChange={() => {setOddComTeamOneRadio(true); setOddComTeamTwoRadio(false);}}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value="NO"/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddComTeamOneRadio(false); setOddComTeamTwoRadio(true);setMatchCompletedDataField('no');}}
                                                                                onKeyDown={(e) => {setOddComTeamTwoTextOneFun(e)}}
                                                                                {...register("match_com_odd_team_2_text_1")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mc_odd_back2')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddComTeamOneRadio(false); setOddComTeamTwoRadio(true);setMatchCompletedDataField('no');}}
                                                                                {...register("match_com_odd_team_2_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mc_odd_lay2')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddComTeamTwoRadio} onChange={() => {setOddComTeamOneRadio(false); setOddComTeamTwoRadio(true);}}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <hr className='mb-1 mt-1'/>
                                            
                                                    <div className='card-header custom-card-header'>
                                                        <label>Match Tied</label>
                                                    </div>
                                                    <div className='card-body custom-card-body'>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label>Odds Diferrence</label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" className='custom-text-box small' {...register("match_tied_odd_diff", { onChange: (e) => {setValue('match_tied_odd_diff', e.target.value)}})}/>
                                                                        <span className='btn btn-warning custom-btn-set ms-1' onClick={setMatchTiedOddData}>Set</span>
                                                                    </td>
                                                                    <td>
                                                                        <span className='btn btn-secondary btn-plus-minus' onClick={()=>{handleMatchTiedRainPlusMinus('plus')}}>+</span>
                                                                        <span className='btn btn-secondary btn-plus-minus ms-1' onClick={()=>{handleMatchTiedRainPlusMinus('minus')}}>-</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className='w-100'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value="YES"/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddTiedTeamOneRadio(true); setOddTiedTeamTwoRadio(false); setMatchTiedDataField('yes');}}
                                                                                onKeyDown={(e) => {setOddTiedTeamOneTextOneFun(e);}}   
                                                                                {...register("match_tied_odd_team_1_text_1")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mt_odd_back1')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddTiedTeamOneRadio(true); setOddTiedTeamTwoRadio(false);setMatchTiedDataField('yes')}}
                                                                                {...register("match_tied_odd_team_1_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mt_odd_lay1')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddTiedTeamOneRadio} onChange={() => {setOddTiedTeamOneRadio(true); setOddTiedTeamTwoRadio(false);}}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <input type="text" className='custom-team-text small' disabled value="NO"/>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-one small' 
                                                                                onFocus={() => {setOddTiedTeamOneRadio(false); setOddTiedTeamTwoRadio(true); setMatchTiedDataField('no');}}
                                                                                onKeyDown={(e) => {setOddTiedTeamTwoTextOneFun(e)}}
                                                                                {...register("match_tied_odd_team_2_text_1")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mt_odd_back2')}/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex'>
                                                                            <input 
                                                                                type="number" 
                                                                                className='custom-text-code-two small' 
                                                                                onFocus={() => {setOddTiedTeamOneRadio(false); setOddTiedTeamTwoRadio(true); setMatchTiedDataField('no');}}
                                                                                {...register("match_tied_odd_team_2_text_2")}
                                                                            />
                                                                            <input type="text" className='custom-team-text small' disabled value={getValues('mt_odd_lay2')}/>
                                                                            <input type="radio" className='form-check-input ms-1' checked={oddTiedTeamTwoRadio} onChange={() => {setOddTiedTeamOneRadio(false); setOddTiedTeamTwoRadio(true);}}/>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='runs-width'>
                                                <div className='row'>
                                                    {
                                                        superOverSection && (
                                                            <>
                                                                <div className='col-md-12'>
                                                                    <div className='card'>
                                                                        <div className='card-header custom-card-header'>
                                                                            <label>India (Super Over): 0/0</label>
                                                                        </div>
                                                                        <div className='card-body custom-card-body'>
                                                                            Super Over:
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-12 mb-1 mt-1'>
                                                                    <div className='card'>
                                                                        <div className='card-header custom-card-header'>
                                                                            <label>Pakistan (Super Over): 3/0</label>
                                                                        </div>
                                                                        <div className='card-body custom-card-body'>
                                                                            Super Over: 
                                                                            <span className="ms-1 badge bg-secondary">0</span> 
                                                                            <span className="ms-1 badge bg-secondary">3</span> 
                                                                            <span className="ms-1 badge bg-secondary">1</span> 
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    <div className='col-md-12 text-center'>
                                                        <div>
                                                            <button className="btn btn-primary cross-btn-runs" type="button" value="0" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(0)}}>0</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="1" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(1)}}>1</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="2" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(2)}}>2</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="3" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(3)}}>3</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="4" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(4)}}>4</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="5" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(5)}}>5</button>
                                                            <button className="btn btn-primary cross-btn-runs ms-2" type="button" value="6" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy(6)}}>6</button>                            
                                                        </div>
                                                        <div>
                                                            <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button" value="Ball" onClick={(e) => {setTvValues(e)}}>Ball Start</button>
                                                        </div>
                                                        <div className='mt-1'>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Wide" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('WD')}}>WD</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Wide +" onClick={(e) => {setTvValues(e); setWideAndNoBallPlus();}}>WD+</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="No Ball" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('NB')}}>NB</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="No Ball +" onClick={(e) => {setTvValues(e); setWideAndNoBallPlus();}}>NB+</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Wicket" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('Wkt')}}>Wkt</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Stumped Out" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('St.Out')}}>St.Out</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Run Out" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('R.Out')}}>R.Out</button>
                                                            <button className="btn btn-danger cross-btn-runs ms-2" type="button" value="Wicket +" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('Wkt+')}}>Wkt+</button>
                                                            <button className="btn btn-danger btn-runs-style-2 ms-2" type="button" value="LBW Out" onClick={(e) => {setTvValues(e); setRunsToBatsmanAndbowlersEconomy('LBW Out')}}>LBW Out</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mt-1'>
                                                    <div className='card'>
                                                        <div className='card-body custom-card-body'>
                                                            <div className='row'>
                                                                <div className='col-md-12'>
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Appeal" onClick={(e) => {setTvValues(e)}}>Appeal</button>
                                                                    <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button"  value="Confirming" onClick={(e) => {setTvValues(e)}}>Confirming</button>
                                                                    <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button" value="Bowler Stop" onClick={(e) => {setTvValues(e)}}>Bowler Stop</button>
                                                                    <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button"  value="Maara" onClick={(e) => {setTvValues(e)}}>Maara</button>
                                                                    <button className="btn btn-pink btn-runs-style-1 ms-2 mt-1" type="button" value="Ball In The Air" onClick={(e) => {setTvValues(e)}}>Ball Hawame</button>
                                                                    <button className="btn btn-pink btn-runs-style-1 ms-2 mt-1" type="button" value="Free Hit" onClick={(e) => {setTvValues(e)}}>Free Hit</button>
                                                                    <button className="btn btn-pink btn-runs-style-1 ms-2 mt-1" type="button" value="3rd Umpire" onClick={(e) => {setTvValues(e)}}>3rd Umpire</button>
                                                                    <button className="btn btn-pink btn-runs-style-1 ms-2 mt-1" type="button"  value="No Ball Checking" onClick={(e) => {setTvValues(e)}}>No Ball Check</button>
                                                                    <button className="btn btn-pink btn-runs-style-1 ms-2 mt-1" type="button"  value="Dead Ball" onClick={(e) => {setTvValues(e)}}>Dead Ball</button>
                                                                    <button className="btn btn-dark btn-runs-style-1 ms-2 mt-1" type="button" value="Review" onClick={(e) => {setTvValues(e)}}>Review</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Batting Team Review" onClick={(e) => {setTvValues(e)}}>Batting Team Review</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Bowling Team Review" onClick={(e) => {setTvValues(e)}}>Bowling Team Review</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Batsman Injured" onClick={(e) => {setTvValues(e)}}>Batsman Injured</button>
                                                                    <button className="btn btn-danger btn-runs-style-2 ms-2 mt-1" type="button" value="Bowler Injured" onClick={(e) => {setTvValues(e)}}>Bowler Injured</button>
                                                                    <button className="btn btn-danger btn-runs-style-2 ms-2 mt-1" type="button" value="Fielder Injured" onClick={(e) => {setTvValues(e)}}>Fielder Injured</button>
                                                                    <button className="btn btn-danger btn-runs-style-2 ms-2 mt-1" type="button" value="Over" onClick={(e) => {setTvValues(e)}}>Over Complete</button>
                                                                    <button className="btn btn-danger btn-runs-style-1 ms-2 mt-1" type="button" value="Maiden Over" onClick={(e) => {setTvValues(e)}}>Maiden Over</button>
                                                                    <button className="btn btn-danger btn-runs-style-1 ms-2 mt-1" type="button" value="Over Throw" onClick={(e) => {setTvValues(e)}}>Over Throw</button>
                                                                </div>
                                                                <hr className='mt-1 mb-1'/>
                                                                <div className='col-md-12'>
                                                                    <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button" value="Catch Dropped" onClick={(e) => {setTvValues(e)}}>Catch Dropped</button>
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Decision Pending" onClick={(e) => {setTvValues(e)}}>Decision Pending</button>                               
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Not Out" onClick={(e) => {setTvValues(e)}}>Not Out</button>
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="No Review" onClick={(e) => {setTvValues(e)}}>No Review</button>
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Thinking For Review" onClick={(e) => {setTvValues(e)}}>Thinking Review</button>
                                                                    <button className="btn btn-pink btn-runs-style-2 ms-2 mt-1" type="button" value="Catch Checking" onClick={(e) => {setTvValues(e)}}>Catch Checking</button>
                                                                    <button className="btn btn-pink btn-runs-style-2 ms-2 mt-1" type="button" value="Review Lost" onClick={(e) => {setTvValues(e)}}>Review Lost</button>
                                                                    <button className="btn btn-pink btn-runs-style-2 ms-2 mt-1" type="button" value="Timeout" onClick={(e) => {setTvValues(e)}}>Timeout</button>
                                                                    <button className="btn btn-pink btn-runs-style-2 ms-2 mt-1" type="button" value="Innings Break" onClick={(e) => {setTvValues(e)}}>Innings Break</button>
                                                                    <button className="btn btn-pink btn-runs-style-2 ms-2 mt-1" type="button" value="Player Injured" onClick={(e) => {setTvValues(e)}}>Player Injured</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Fast Bowler" onClick={(e) => {setTvValues(e)}}>Fast Bowler</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Spinner Bowler" onClick={(e) => {setTvValues(e)}}>Spinner Bowler</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Boundary Check" onClick={(e) => {setTvValues(e)}}>Boundary Check</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="Missed Fielding" onClick={(e) => {setTvValues(e)}}>Missed Fielding</button>
                                                                    <button className="btn btn-dark btn-runs-style-2 ms-2 mt-1" type="button" value="First Bounce" onClick={(e) => {setTvValues(e)}}>First Bounce</button>
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="Bowler Change" onClick={(e) => {setTvValues(e)}}>Bowler Change</button>
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="Same Bowler" onClick={(e) => {setTvValues(e)}}>Same Bowler</button>
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="Rain" onClick={(e) => {setTvValues(e)}}>Rain</button>                
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="Int AdBrk" onClick={() => {setAddBreak(true)}}>Int AdBrk</button>
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="Pvt. AdBrk" onClick={(e) => {setAddBreak(true)}}>Pvt. AdBrk</button>
                                                                    <button className="btn btn-success btn-runs-style-2 ms-2 mt-1" type="button" value="TV Pvt. AdBrk" onClick={(e) => {setAddBreak(true)}}>TV Pvt. AdBrk</button>
                                                                </div>
                                                                <hr className='mt-1 mb-1'/>
                                                                <div className='col-md-12'>
                                                                    <button className="btn btn-primary btn-runs-style-1 ms-2 mt-1" type="button" value="Bye Runs" onClick={(e) => {setTvValues(e)}}>Bye Runs</button>
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Leg Bye Runs" onClick={(e) => {setTvValues(e)}}>Leg Bye Runs</button>                               
                                                                    <button className="btn btn-primary btn-runs-style-2 ms-2 mt-1" type="button" value="Umpire Decision Review" onClick={(e) => {setTvValues(e)}}>Umpire Decision Review</button>
                                                                </div>
                                                                <hr className='mt-1 mb-1'/>
                                                                <div className='col-md-12'>
                                                                    <div className='card'>
                                                                        <div className='card-header custom-card-header'>
                                                                            <label>Session Info</label>
                                                                            <label className='float-end mx-2'>Session API</label> 
                                                                            <input type="checkbox" className="form-check-input float-end" {...register("session_api")} onChange={(e) => {handleAPIs(e, 'session');}}/> 
                                                                        </div>
                                                                        <div className='card-body custom-card-body'>
                                                                            <ReactQuill theme="snow" value={sessionValue} onChange={setSessionValue} />
                                                                            <span className='btn btn-primary custom-btn w-100' onClick={()=>{handleSubmitData()}}>Add Session Info</span>
                                                                        </div>
                                                                        <div className='card-header custom-card-header'>
                                                                            <label>Pitch Report</label>
                                                                        </div>
                                                                        <div className='card-body custom-card-body'>
                                                                            <ReactQuill theme="snow" value={getValues('pitch_report')} onChange={(e) => setPitchReport(e)} />
                                                                            <span className='btn btn-primary custom-btn w-100' onClick={()=>{handleSubmitPitchData()}}>Add Pitch Report</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row text-center mt-2 mb-2'>
                                            <div className='col-md-12'>
                                                <span className='btn btn-danger custom-btn'>Clear All</span>
                                                <span className='btn btn-primary ms-2 custom-btn'>Match Finish</span>
                                                <span className='btn btn-success ms-2 custom-btn' onClick={()=>handleSubmitData()}>Update Score</span>
                                            </div>
                                        </div>
                                        <input type="submit" id="mySubmitBtn" className='d-none' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
