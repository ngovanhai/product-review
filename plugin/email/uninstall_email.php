<?php 
	$select_settings = $db->query("SELECT * FROM shop_installed WHERE shop = '$shop' and app_id = $appId");
	$installed = $select_settings->fetch_object();	
	if($installed) {
		$xml ='<xmlrequest>
			<username>madmin</username>
			<usertoken>a3538fd0f3e37560114ede32c2c0886b387cc667</usertoken>
			<requesttype>subscribers</requesttype>
			<requestmethod>UnsubscribeSubscriber</requestmethod>
			<details>
				<emailaddress>'.$installed->email_shop.'</emailaddress>
				<listid>'.$iemid.'</listid>
			</details>
		</xmlrequest>'; 
		$ch = curl_init('https://www.omegatheme.com/iem/xml.php');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
		$result = @curl_exec($ch);	
		
		if($result === false) {
			db_insert("test_data",['test' => 'Error performing request']);
		}else {
			$xml_doc = simplexml_load_string($result);
			
			if ($xml_doc->status == 'SUCCESS') { 
			} else {
				db_insert("test_data",['test' => $appName.'Error is:'.$xml_doc->errormessage]);   
			}
		}
				
		AddSubscriberToList($installed->name_shop, $installed->email_shop,  $iemid_unsub);
	}
	
	
	function AddSubscriberToList($name, $email, $iemid_unsub) {
		$xml = '<xmlrequest>
			<username>madmin</username>
			<usertoken>a3538fd0f3e37560114ede32c2c0886b387cc667</usertoken>
			<requesttype>subscribers</requesttype>
			<requestmethod>AddSubscriberToList</requestmethod>
			<details>
				<emailaddress>'.$email.'</emailaddress>
				<mailinglist>'.$iemid_unsub.'</mailinglist>
				<format>html</format>
				<confirmed>yes</confirmed>
				<customfields>
					<item>
						<fieldid>1</fieldid>
						<value>'.$name.'</value>
					</item>			
				</customfields>
			</details>
		</xmlrequest>
		';
		
		$ch = curl_init('https://www.omegatheme.com/iem/xml.php');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
		$result = @curl_exec($ch);	
	}
	
 


	