<?php
//version: Liu ChuanRen, 05/02/08
class finance{
	function minusTax($money,$type=""){
		return call_user_method("minusTax_".$type,new finance(),$money);
	}
	function minusTax_($money){
		return array("tax"=>0,"tariff"=>0);
	}
	function minusTax_salary($money){
		$money=$money-2000;
		if($money<=0){
			$tariff=0;
			$r=0;
		}elseif($money<=500){
			$tariff=0.05;
			$r=0;
		}elseif($money<=2000){
			$tariff=0.10;
			$r=25;
		}elseif($money<=5000){
			$tariff=0.15;
			$r=125;
		}elseif($money<=20000){
			$tariff=0.20;
			$r=375;
		}elseif($money<=40000){
			$tariff=0.25;
			$r=1375;
		}elseif($money<=60000){
			$tariff=0.30;
			$r=3375;
		}elseif($money<=80000){
			$tariff=0.35;
			$r=6375;
		}elseif($money<=100000){
			$tariff=0.40;
			$r=10375;
		}else{
			$tariff=0.45;
			$r=15375;
		}
		$result['tariff']=$tariff;
		$result['tax']=abs($money*$tariff-$r);
		return $result;
	}
	function minusTax_fee($money){
		if($money<=4000)$money=$money-800;
		else $money=$money*0.8;
		if($money<=0){
			$tariff=0;
			$r=0;
		}elseif($money<=20000){
			$tariff=0.20;
			$r=0;
		}elseif($money<=50000){
			$tariff=0.30;
			$r=2000;
		}else{
			$tariff=0.40;
			$r=7000;
		}
		$result['tariff']=$tariff;
		$result['tax']=abs($money*$tariff-$r);
		return $result;
	}
	function plusTax($money,$type){
		$a=$money;
		$b=2*$money;
		$r=0.00001;
		do{
			$c=($a+$b)*0.5;
			$result=finance::minusTax($c,$type);
			$d=$c-$result['tax']-$money;
			if($d>0){
				$b=$c;
			}else{
				$a=$c;
			}
		}while($b-$a>$r&&abs($d)>$r);
		return $result;
	}
}
?>
