<?php
error_reporting(~E_WARNING & ~E_STRICT & ~E_NOTICE );
include "koneksi.php";

$data = $db->get_results("SELECT DISTINCT
							(a.nim) AS nim,
							b.angkatan
						FROM
							nilai AS a
						JOIN mhs AS b ON b.nim = a.nim
						WHERE
							a.nim = '170155201057'
						ORDER BY
							a.nim ASC");
//AND b.id_prodi = 12

$ip = 0;
$jumlah_sks = 0;
$bxs = 0;
$batas_sks = 0;
$smstr = 'R122';
$smstr_tuju = 'R222';

foreach($data as $d)
{
	$nilais = get_yudisium($d->nim, $smstr);
	$bobots = get_bobot();

	$ip = 0;
	$jumlah_sks = 0;
	$bxs = 0;
	$batas_sks = 0;

	foreach($nilais as $nilai)
	{
		$nilai_rounded = round($nilai->nilai_akhir);
		//print_r($nilai);
		$jumlah_sks += $nilai->sks;
		$bxs	    += $bobots[$nilai_rounded] * $nilai->sks;
	}

	$ip = round($bxs/$jumlah_sks,2);
	$sks_maks = get_batas_sks($ip, $smstr);

	/**
	 * Migrasi nilai ke nilai_{angkatan}
	 */
	$nilainya = get_migrasi_nilai($d->nim, $smstr);
	foreach($nilainya as $nl)
	{
		$nilaidia = (array) $nl;
		insert_datanilai($nilaidia, $d->angkatan);
	}

	//transkrip

	$nilaif = get_transkrip($d->nim, $d->angkatan);

	foreach($nilaif as $nilai)
	{
		$nilai_rounded = round($nilai->nilai_akhir);
		//print_r($nilai);
		$jumlah_sks_f += $nilai->sks;
		$bxsf	    += $bobots[$nilai_rounded] * $nilai->sks;
	}

	$ipk = round($bxsf/$jumlah_sks_f,2);

	$data = array(
			'nim'		=> $d->nim,
			'ips'		=> $ip,
			'ipk'		=> $ipk,
			'max_sks'	=> $sks_maks,
			'sks_smstr'	=> $jumlah_sks,
			'sks_total'	=> $jumlah_sks_f
			);

	insert_datasksmax($data, $smstr_tuju);

	echo "$d->nim \t $d->angkatan \t $jumlah_sks \t $bxs \t $ip \t $ipk \n";

	$ip = 0;
	$jumlah_sks = 0;
	$jumlah_sks_f = 0;
	$bxs = 0;
	$bxsf = 0;
	$batas_sks = 0;

}

function get_yudisium($nim, $smstr)
{
	global $db;
	$tabel_krs = $smstr.'_krs';

	$data = $db->get_results("
						SELECT
						distinct(a.kode_jadwal),
						a.nim,
						a.kode_mk ,
						'$smstr' as smstr,
						b.sks,
					(select nilai_akhir from nilai where nim = a.nim and kode_jadwal = a.kode_jadwal
					and kode_mk = a.kode_mk and smstr = '$smstr') as nilai_akhir
					FROM
						$tabel_krs AS a
					JOIN matakuliah AS b ON b.kode_mk = a.kode_mk
					WHERE
						a.nim = '$nim' AND setuju = 'yes' AND used = 'yes' AND b.smstr = '$smstr'
					GROUP BY
						nim ,
						kode_mk ,
						smstr
					");
	return $data;
}

function get_transkrip( $nim, $angkatan )
{
	global $db;
	$tabel = 'nilai_'.$angkatan;

	$data = $db->get_results("select a.nim, a.kode_mk, a.smstr, a.nilai_akhir, b.sks
						from $tabel as a
						join matakuliah as b on b.kode_mk = a.kode_mk and a.smstr = b.smstr
						where a.nim = '$nim'
						GROUP BY
							nim ,
							kode_mk
						ORDER BY nilai_akhir DESC, kode_mk DESC");

	return $data;
}

function get_bobot()
{
	global $db;
	$data = $db->get_results("SELECT * FROM master_bobotnilai_2015");
	foreach($data as $dt)
	{
		$bobot[$dt->nilai_a]		= $dt->bobot;
	}
	return $bobot;
}

function get_batas_sks($ip, $smstr)
{
	global $db;

		// CEK SPESIAL SEMESTER //
		$gg = substr($smstr , 1, 1);
		if ($gg == 1){
			$tgg = 'ganjil';
		} else {
			$tgg = 'genap';
		}

		$tb_bobot = $db->prefix.'master_bobotnilai_'.$tgg;
		
		$data = $db->get_var("SELECT special_smstr FROM $tb_bobot 
								WHERE special_smstr = (SELECT max(special_smstr) FROM $tb_bobot
														WHERE special_smstr <= '$smstr') LIMIT 1");
		//
		if($data == 'R221' || $data == 'R122'|| $data == 'R222'){
			return $db->get_var("SELECT sks_maksimum FROM master_sksmaksimum_2022 WHERE $ip BETWEEN min AND max");
		}else{
			return $db->get_var("SELECT sks_maksimum FROM master_sksmaksimum WHERE $ip BETWEEN min AND max");
		}

		// return $db->get_var("SELECT sks_maksimum FROM master_sksmaksimum WHERE $ip BETWEEN min AND max");
}

function insert_datanilai($data, $angkatan)
{
	global $db;
	$tabel = 'nilai_'.$angkatan;
	//cek
	$cek = $db->get_var("SELECT nim FROM $tabel
						WHERE nim = '$data[nim]'
						AND kode_jadwal = '$data[kode_jadwal]'
						AND smstr = '$data[smstr]'
						LIMIT 1");
	if($cek == $data['nim'])
	{
		$where = array('nim' => $data['nim'], 'kode_jadwal' => $data['kode_jadwal'],
		'smstr' => $data['smstr']);
		$db->update($tabel, $data, $where);
	}else{
		$db->insert($tabel, $data);
	}

	//echo $db->last_query;

}

function insert_datasksmax($data, $smstr)
{
	global $db;
	$tabel = $smstr.'_sksmaks';
	$nim = $data['nim'];
	//cek
	$cek = $db->get_var("SELECT nim FROM $tabel WHERE nim = '$nim' LIMIT 1");
	if($cek == $nim)
	{
		$where = array('nim' => $nim);
		$update = array('ips' => $data['ips'],
						'max_sks' => $data['max_sks'],
						'ipk' => $data['ipk'],
						'sks_smstr'	=> $data['sks_smstr'],
						'sks_total'	=> $data['sks_total']
						);
		$db->update($tabel, $update, $where);
	}else{
		$db->insert($tabel, $data);
	}

}

function get_migrasi_nilai($nim, $smstr)
{
	global $db;
	$tabel_krs = $smstr.'_krs';
	$data = $db->get_results("
				SELECT
					a.nim,
					a.kode_mk,
					a.kode_jadwal,
					'$smstr' as smstr,
					c.nilai_a,c.nilai_b,c.nilai_c,c.nilai_d,
					c.nilai_e,c.nilai_f,
					c.nilai_harian, c.nilai_mid,
					c.nilai_akhir,
					c.nilai_ujian,
					c.nilai_huruf,
					c.user_insert,
					c.time_insert,
					c.ip_insert,
					c.user_update,
					c.time_update,
					c.ip_update,
					c.is_validated,
					c.is_used
				FROM
					$tabel_krs AS a
				JOIN matakuliah AS b ON b.kode_mk = a.kode_mk
				LEFT JOIN nilai AS c ON c.nim = a.nim and c.kode_jadwal = a.kode_jadwal and c.kode_mk = a.kode_mk
				and c.smstr = '$smstr'
				WHERE
					a.nim = '$nim' AND a.setuju = 'yes' AND used = 'yes'
				GROUP BY
					a.nim,
					a.kode_jadwal,
					c.smstr
				");
	return $data;
}
